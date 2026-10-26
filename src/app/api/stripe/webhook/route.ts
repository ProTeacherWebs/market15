import { NextResponse } from "next/server"
import { handleStripeWebhookEvent } from "@/lib/payments/stripe-adapter"
import { getStripe } from "@/lib/stripe"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return NextResponse.json({ message: "STRIPE_WEBHOOK_SECRET не задан" }, { status: 500 })
  }

  let event
  try {
    const stripe = getStripe()
    const signature = req.headers.get("stripe-signature")
    if (!signature) {
      return NextResponse.json({ message: "Нет stripe-signature" }, { status: 400 })
    }
    event = stripe.webhooks.constructEvent(await req.text(), signature, webhookSecret)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook Error"
    return NextResponse.json({ message: `Webhook Error: ${message}` }, { status: 400 })
  }

  try {
    await handleStripeWebhookEvent(event)
  } catch (error) {
    const message = error instanceof Error ? error.message : "handler failed"
    return NextResponse.json({ message }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
