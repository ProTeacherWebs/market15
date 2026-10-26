import Stripe from "stripe"

export type PaymentMode = "stripe_test" | "stripe_live"

export function getPaymentMode(): PaymentMode {
  const mode = process.env.PAYMENT_MODE ?? "stripe_test"
  if (mode === "stripe_live" || mode === "stripe_test") return mode
  throw new Error("PAYMENT_MODE должен быть stripe_test или stripe_live")
}

export function getAppBaseUrl() {
  const url = process.env.AUTH_URL || process.env.APP_URL || "http://localhost:3000"
  return url.replace(/\/$/, "")
}

/** Stripe не принимает UZS — для test mode конвертируем в USD по курсу из env. */
export function uzsToStripeUsdCents(totalUzs: number) {
  const rate = Number(process.env.STRIPE_UZS_PER_USD || "12500")
  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error("STRIPE_UZS_PER_USD должен быть положительным числом")
  }
  const cents = Math.round((totalUzs / rate) * 100)
  return Math.max(50, cents)
}

export function assertStripeKeyMatchesMode(secretKey: string, mode: PaymentMode) {
  if (secretKey.startsWith("sk_live") && mode !== "stripe_live") {
    throw new Error("Live-ключ Stripe запрещён: поставьте PAYMENT_MODE=stripe_live только для боя")
  }
  if (mode === "stripe_test" && !secretKey.startsWith("sk_test")) {
    throw new Error("Для PAYMENT_MODE=stripe_test нужен ключ sk_test_…")
  }
  if (mode === "stripe_live" && !secretKey.startsWith("sk_live")) {
    throw new Error("Для PAYMENT_MODE=stripe_live нужен ключ sk_live_…")
  }
}

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY)
}

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) throw new Error("STRIPE_SECRET_KEY не задан")
  const mode = getPaymentMode()
  assertStripeKeyMatchesMode(secretKey, mode)
  return new Stripe(secretKey)
}

export function isTestPaymentMode() {
  return getPaymentMode() === "stripe_test"
}
