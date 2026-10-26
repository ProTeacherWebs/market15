import { eq } from "drizzle-orm"
import type Stripe from "stripe"
import { db } from "@/db"
import { orders, paymentEvents } from "@/db/schema"
import {
  getAppBaseUrl,
  getStripe,
  isTestPaymentMode,
  uzsToStripeUsdCents,
} from "@/lib/stripe"

export async function createStripeCheckoutForOrder(input: {
  orderId: string
  orderNumber: string
  customerEmail: string
  totalUzs: number
  currency: string
}) {
  const stripe = getStripe()
  const amount = uzsToStripeUsdCents(input.totalUzs)
  const base = getAppBaseUrl()

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: input.customerEmail,
    client_reference_id: input.orderId,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: amount,
          product_data: {
            name: `Заказ ${input.orderNumber}`,
            description: `Тестовая оплата Stripe. В магазине ${input.totalUzs.toLocaleString("ru-RU")} ${input.currency}. В Stripe — USD по курсу теста.`,
          },
        },
      },
    ],
    metadata: {
      orderId: input.orderId,
      orderNumber: input.orderNumber,
      totalUzs: String(input.totalUzs),
      paymentMode: isTestPaymentMode() ? "stripe_test" : "stripe_live",
    },
    payment_intent_data: {
      metadata: {
        orderId: input.orderId,
        orderNumber: input.orderNumber,
      },
    },
    success_url: `${base}/checkout/result?order=${encodeURIComponent(input.orderNumber)}&payment=success`,
    cancel_url: `${base}/checkout/result?order=${encodeURIComponent(input.orderNumber)}&payment=cancelled`,
  })

  await db
    .update(orders)
    .set({
      paymentStatus: "pending",
      paymentProvider: "stripe",
      isTestPayment: isTestPaymentMode(),
      updatedAt: new Date(),
    })
    .where(eq(orders.id, input.orderId))

  await db.insert(paymentEvents).values({
    id: crypto.randomUUID(),
    orderId: input.orderId,
    provider: "stripe",
    providerEventId: session.id,
    eventType: "checkout.session.created",
    status: session.status ?? "open",
    payloadSummary: {
      amountTotal: session.amount_total,
      currency: session.currency,
      url: session.url,
    },
  })

  if (!session.url) throw new Error("Stripe не вернул URL оплаты")
  return { url: session.url, sessionId: session.id, amountUsdCents: amount }
}

async function markOrderPayment(input: {
  orderId: string
  paymentStatus: "paid" | "failed" | "cancelled" | "pending"
  orderStatus?: "confirmed" | "cancelled" | "pending"
  event: Stripe.Event
  summary: Record<string, unknown>
}) {
  const existing = await db
    .select({ id: paymentEvents.id })
    .from(paymentEvents)
    .where(eq(paymentEvents.providerEventId, input.event.id))
    .limit(1)
  if (existing[0]) return { duplicate: true as const }

  await db.insert(paymentEvents).values({
    id: crypto.randomUUID(),
    orderId: input.orderId,
    provider: "stripe",
    providerEventId: input.event.id,
    eventType: input.event.type,
    status: input.paymentStatus,
    payloadSummary: input.summary,
  })

  const patch: {
    paymentStatus: typeof input.paymentStatus
    updatedAt: Date
    status?: "confirmed" | "cancelled" | "pending"
  } = {
    paymentStatus: input.paymentStatus,
    updatedAt: new Date(),
  }
  if (input.orderStatus) patch.status = input.orderStatus

  const current = await db.select().from(orders).where(eq(orders.id, input.orderId)).limit(1)
  const order = current[0]
  if (!order) return { duplicate: false as const, missing: true as const }
  if (order.paymentStatus === "paid" && input.paymentStatus !== "paid") {
    return { duplicate: false as const, skipped: true as const }
  }

  await db.update(orders).set(patch).where(eq(orders.id, input.orderId))
  return { duplicate: false as const }
}

export async function handleStripeWebhookEvent(event: Stripe.Event) {
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const orderId = session.metadata?.orderId || session.client_reference_id
    if (!orderId) throw new Error("В сессии нет orderId")
    if (session.payment_status !== "paid") {
      return markOrderPayment({
        orderId,
        paymentStatus: "pending",
        event,
        summary: { payment_status: session.payment_status, sessionId: session.id },
      })
    }
    return markOrderPayment({
      orderId,
      paymentStatus: "paid",
      orderStatus: "confirmed",
      event,
      summary: {
        sessionId: session.id,
        amount_total: session.amount_total,
        currency: session.currency,
        payment_status: session.payment_status,
      },
    })
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session
    const orderId = session.metadata?.orderId || session.client_reference_id
    if (!orderId) throw new Error("В сессии нет orderId")
    return markOrderPayment({
      orderId,
      paymentStatus: "cancelled",
      orderStatus: "cancelled",
      event,
      summary: { sessionId: session.id, status: session.status },
    })
  }

  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object as Stripe.PaymentIntent
    const orderId = intent.metadata?.orderId
    if (!orderId) return { ignored: true as const }
    return markOrderPayment({
      orderId,
      paymentStatus: "failed",
      event,
      summary: {
        intentId: intent.id,
        message: intent.last_payment_error?.message ?? null,
      },
    })
  }

  return { ignored: true as const }
}

/** Подтверждение оплаты по API Stripe (если webhook ещё не дошёл). */
export async function syncOrderPaymentFromStripe(orderId: string) {
  const events = await db
    .select()
    .from(paymentEvents)
    .where(eq(paymentEvents.orderId, orderId))

  const sessionIds = events
    .filter(
      (event) =>
        event.eventType === "checkout.session.created" &&
        event.providerEventId?.startsWith("cs_"),
    )
    .map((event) => event.providerEventId!)

  if (sessionIds.length === 0) return { synced: false as const }

  const stripe = getStripe()
  for (const sessionId of sessionIds.reverse()) {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status === "paid") {
      const marker = `sync:${session.id}`
      const already = await db
        .select({ id: paymentEvents.id })
        .from(paymentEvents)
        .where(eq(paymentEvents.providerEventId, marker))
        .limit(1)
      if (!already[0]) {
        await db.insert(paymentEvents).values({
          id: crypto.randomUUID(),
          orderId,
          provider: "stripe",
          providerEventId: marker,
          eventType: "checkout.session.sync",
          status: "paid",
          payloadSummary: {
            sessionId: session.id,
            amount_total: session.amount_total,
            currency: session.currency,
          },
        })
      }
      await db
        .update(orders)
        .set({
          paymentStatus: "paid",
          status: "confirmed",
          updatedAt: new Date(),
        })
        .where(eq(orders.id, orderId))
      return { synced: true as const, paymentStatus: "paid" as const }
    }
    if (session.status === "expired") {
      await db
        .update(orders)
        .set({
          paymentStatus: "cancelled",
          updatedAt: new Date(),
        })
        .where(eq(orders.id, orderId))
      return { synced: true as const, paymentStatus: "cancelled" as const }
    }
  }

  return { synced: false as const }
}
