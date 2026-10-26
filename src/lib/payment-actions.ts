"use server"

import { and, eq } from "drizzle-orm"
import { auth } from "@/auth"
import { db } from "@/db"
import { orders } from "@/db/schema"
import {
  createStripeCheckoutForOrder,
  syncOrderPaymentFromStripe,
} from "@/lib/payments/stripe-adapter"
import { isStripeConfigured } from "@/lib/stripe"

async function loadOwnedOrder(orderNumber: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: "Нужен вход" as const }
  const rows = await db
    .select()
    .from(orders)
    .where(and(eq(orders.orderNumber, orderNumber), eq(orders.userId, session.user.id)))
    .limit(1)
  const order = rows[0]
  if (!order) return { error: "Заказ не найден" as const }
  return { order }
}

export async function startStripeCheckoutAction(orderNumber: string) {
  if (!isStripeConfigured()) {
    return {
      ok: false as const,
      error: "Stripe не настроен. Добавьте STRIPE_SECRET_KEY и PAYMENT_MODE=stripe_test",
    }
  }

  const loaded = await loadOwnedOrder(orderNumber)
  if ("error" in loaded) return { ok: false as const, error: loaded.error }
  const { order } = loaded
  if (order.paymentStatus === "paid") {
    return { ok: false as const, error: "Заказ уже оплачен" }
  }

  try {
    const checkout = await createStripeCheckoutForOrder({
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerEmail: order.customerEmail,
      totalUzs: order.totalUzs,
      currency: order.currency,
    })
    return { ok: true as const, url: checkout.url }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Не удалось создать оплату"
    return { ok: false as const, error: message }
  }
}

export async function syncStripePaymentAction(orderNumber: string) {
  if (!isStripeConfigured()) {
    return { ok: false as const, error: "Stripe не настроен" }
  }
  const loaded = await loadOwnedOrder(orderNumber)
  if ("error" in loaded) return { ok: false as const, error: loaded.error }
  if (loaded.order.paymentStatus === "paid") {
    return { ok: true as const, paymentStatus: "paid" as const }
  }
  try {
    const result = await syncOrderPaymentFromStripe(loaded.order.id)
    if (result.synced && result.paymentStatus) {
      return { ok: true as const, paymentStatus: result.paymentStatus }
    }
    return { ok: true as const, paymentStatus: loaded.order.paymentStatus }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Не удалось сверить оплату"
    return { ok: false as const, error: message }
  }
}

export async function getStripeSetupHint() {
  return {
    configured: isStripeConfigured(),
    mode: process.env.PAYMENT_MODE ?? "stripe_test",
  }
}
