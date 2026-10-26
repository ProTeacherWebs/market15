"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useShop } from "@/components/shop-provider"
import { formatUzs } from "@/data/catalog"
import { startStripeCheckoutAction } from "@/lib/payment-actions"
import { getOrderForOwner, type ShopOrder } from "@/lib/shop-actions"

const deliveryLabel = {
  pickup: "Самовывоз",
  courier: "Доставка по Ташкенту",
}

export default function OrderPage() {
  const params = useParams<{ orderId: string }>()
  const router = useRouter()
  const shop = useShop()
  const [order, setOrder] = useState<ShopOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [payError, setPayError] = useState("")

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      const fetched = await getOrderForOwner(params.orderId)
      if (!cancelled) {
        setOrder(fetched)
        setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [params.orderId, shop.orders])

  async function pay() {
    if (!order || paying) return
    setPaying(true)
    setPayError("")
    const result = await startStripeCheckoutAction(order.number)
    if (!result.ok) {
      setPayError(result.error ?? "Не удалось открыть Stripe")
      setPaying(false)
      return
    }
    router.push(result.url)
  }

  if (!shop.ready || loading) {
    return <p className="mx-auto w-full max-w-[720px] px-4 py-8 text-muted">Загрузка заказа.</p>
  }

  if (!shop.user) {
    return (
      <main className="mx-auto w-full max-w-[720px] px-4 py-8">
        <h1 className="text-3xl font-semibold text-ink">Нужен вход</h1>
        <Link href="/login" className="mt-4 inline-block text-accent">
          Войти
        </Link>
      </main>
    )
  }

  if (!order) {
    return (
      <main className="mx-auto w-full max-w-[720px] px-4 py-8">
        <h1 className="text-3xl font-semibold text-ink">Заказ не найден</h1>
        <Link href="/account" className="mt-4 inline-block text-accent">
          К аккаунту
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-[720px] px-4 py-8">
      <h1 className="text-3xl font-semibold text-ink">Заказ {order.number}</h1>
      <p className="mt-4 text-ink">{order.customerName}</p>
      <p className="text-muted">{order.phone}</p>
      <p className="text-muted">{order.email}</p>
      <p className="mt-4 text-ink">{deliveryLabel[order.deliveryMethod]}</p>
      {order.address ? <p className="text-muted">{order.address}</p> : null}
      <ul className="mt-6 grid gap-3">
        {order.items.map((item) => (
          <li key={item.sku} className="border-b border-line pb-3 text-sm">
            <p className="text-ink">{item.name}</p>
            <p className="text-muted">
              {item.sku}, {item.quantity} шт. по {formatUzs(item.unitPrice)}
            </p>
            <p className="tabular-nums text-ink">{formatUzs(item.lineTotal)}</p>
          </li>
        ))}
      </ul>
      <p className="mt-4 tabular-nums text-ink">Сумма товаров {formatUzs(order.subtotal)}</p>
      <p className="mt-2 text-sm text-muted">
        Статус: {order.status}. Оплата: {order.paymentStatus}.
      </p>
      {payError ? <p className="mt-3 text-sm text-danger">{payError}</p> : null}
      {order.paymentStatus !== "paid" ? (
        <button
          type="button"
          disabled={paying}
          onClick={() => void pay()}
          className="mt-6 inline-flex h-11 items-center rounded-full bg-accent px-5 text-sm font-medium text-accent-ink disabled:bg-surface-raised disabled:text-muted"
        >
          {paying ? "Открываем Stripe…" : "Оплатить через Stripe (тест)"}
        </button>
      ) : null}
    </main>
  )
}
