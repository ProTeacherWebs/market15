"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { useAppHref } from "@/components/link-base"
import { useShop } from "@/components/shop-provider"
import { formatUzs } from "@/data/catalog"
import { startStripeCheckoutAction, syncStripePaymentAction } from "@/lib/payment-actions"
import { getOrderForOwner, type ShopOrder } from "@/lib/shop-actions"

const paymentLabels: Record<string, string> = {
  not_started: "не начата",
  pending: "ожидает оплаты",
  paid: "оплачен",
  failed: "ошибка оплаты",
  cancelled: "отменена",
  refunded: "возврат",
}

function Result() {
  const params = useSearchParams()
  const router = useRouter()
  const number = params.get("order")
  const paymentFlag = params.get("payment")
  const payErrorParam = params.get("payError")
  const shop = useShop()
  const accountOrderHref = useAppHref(number ? `/account/orders/${number}` : "/account")
  const [order, setOrder] = useState<ShopOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [payError, setPayError] = useState(payErrorParam ?? "")
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!number) {
        setOrder(null)
        setLoading(false)
        return
      }
      if (paymentFlag === "success") {
        await syncStripePaymentAction(number)
      }
      const fetched = await getOrderForOwner(number)
      if (!cancelled) {
        setOrder(fetched)
        setLoading(false)
      }
    }
    void load()
    const timer =
      paymentFlag === "success"
        ? window.setInterval(() => {
            void load()
          }, 2500)
        : undefined
    return () => {
      cancelled = true
      if (timer) window.clearInterval(timer)
    }
  }, [number, paymentFlag, shop.orders])

  async function pay() {
    if (!number || paying) return
    setPaying(true)
    setPayError("")
    const result = await startStripeCheckoutAction(number)
    if (!result.ok) {
      setPayError(result.error ?? "Не удалось открыть Stripe")
      setPaying(false)
      return
    }
    router.push(result.url)
  }

  if (!shop.ready || loading) return <p className="text-muted">Загрузка результата.</p>
  if (!order) {
    return (
      <>
        <h1 className="text-3xl font-semibold text-ink">Заказ не найден</h1>
        <p className="mt-3 text-muted">Заказ виден только владельцу после входа.</p>
      </>
    )
  }

  const canPay = order.paymentStatus !== "paid"
  const banner =
    paymentFlag === "success"
      ? "Вернулись из Stripe. Сверяем оплату с сервером Stripe…"
      : paymentFlag === "cancelled"
        ? "Оплата отменена в Stripe. Можно попробовать снова."
        : null

  return (
    <>
      <p className="rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-ink">
        Тестовая оплата Stripe (test mode). Реальные деньги не списываются. Карта теста:{" "}
        <span className="font-mono">4242 4242 4242 4242</span>.
      </p>
      <h1 className="mt-6 text-3xl font-semibold text-ink">Заказ {order.number}</h1>
      {banner ? <p className="mt-3 text-muted">{banner}</p> : null}
      <p className="mt-6 text-ink">Статус: {order.status}</p>
      <p className="mt-2 text-ink">
        Оплата: {paymentLabels[order.paymentStatus] ?? order.paymentStatus}
      </p>
      <ul className="mt-6 grid gap-2 text-sm text-muted">
        {order.items.map((item) => (
          <li key={item.sku}>
            {item.name}, {item.quantity} шт., {formatUzs(item.lineTotal)}
          </li>
        ))}
      </ul>
      <p className="mt-4 tabular-nums text-ink">Сумма товаров {formatUzs(order.subtotal)}</p>
      <p className="mt-2 text-sm text-muted">
        В Stripe сумма уходит в USD по курсу теста (STRIPE_UZS_PER_USD), итог заказа в базе — в сумах.
      </p>
      {payError ? <p className="mt-4 text-sm text-danger">{payError}</p> : null}
      {canPay ? (
        <button
          type="button"
          disabled={paying}
          onClick={() => void pay()}
          className="mt-6 inline-flex h-11 items-center rounded-full bg-accent px-5 text-sm font-medium text-accent-ink disabled:bg-surface-raised disabled:text-muted"
        >
          {paying ? "Открываем Stripe…" : "Оплатить через Stripe (тест)"}
        </button>
      ) : (
        <p className="mt-6 text-sm text-accent">Оплата подтверждена.</p>
      )}
      <Link href={accountOrderHref} className="mt-6 block text-accent">
        Открыть в аккаунте
      </Link>
    </>
  )
}

export default function CheckoutResultPage() {
  return (
    <main className="mx-auto w-full max-w-[720px] px-4 py-8">
      <Suspense fallback={<p className="text-muted">Загрузка результата.</p>}>
        <Result />
      </Suspense>
    </main>
  )
}
