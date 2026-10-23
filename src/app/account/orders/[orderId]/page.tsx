"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useShop } from "@/components/shop-provider"
import { formatUzs } from "@/data/catalog"
import { getOrderForOwner, type ShopOrder } from "@/lib/shop-actions"

const deliveryLabel = {
  pickup: "Самовывоз",
  courier: "Доставка по Ташкенту",
}

export default function OrderPage() {
  const params = useParams<{ orderId: string }>()
  const shop = useShop()
  const [order, setOrder] = useState<ShopOrder | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      const fromShop = shop.orders.find((item) => item.number === params.orderId)
      if (fromShop) {
        if (!cancelled) {
          setOrder(fromShop)
          setLoading(false)
        }
        return
      }
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
    </main>
  )
}
