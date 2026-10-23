"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { useShop } from "@/components/shop-provider"
import { formatUzs } from "@/data/catalog"
import { getOrderForOwner, type ShopOrder } from "@/lib/shop-actions"

function Result() {
  const params = useSearchParams()
  const number = params.get("order")
  const shop = useShop()
  const [order, setOrder] = useState<ShopOrder | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!number) {
        setOrder(null)
        setLoading(false)
        return
      }
      const fromShop = shop.orders.find((item) => item.number === number)
      if (fromShop) {
        if (!cancelled) {
          setOrder(fromShop)
          setLoading(false)
        }
        return
      }
      const fetched = await getOrderForOwner(number)
      if (!cancelled) {
        setOrder(fetched)
        setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [number, shop.orders])

  if (!shop.ready || loading) return <p className="text-muted">Загрузка результата.</p>
  if (!order) {
    return (
      <>
        <h1 className="text-3xl font-semibold text-ink">Заказ не найден</h1>
        <p className="mt-3 text-muted">Заказ виден только владельцу после входа.</p>
      </>
    )
  }

  return (
    <>
      <h1 className="text-3xl font-semibold text-ink">Заказ {order.number}</h1>
      <p className="mt-3 text-muted">Заказ сохранён. Оплата ещё не подключена.</p>
      <p className="mt-6 text-ink">Статус: {order.status}</p>
      <p className="mt-2 text-ink">Оплата: {order.paymentStatus}</p>
      <ul className="mt-6 grid gap-2 text-sm text-muted">
        {order.items.map((item) => (
          <li key={item.sku}>
            {item.name}, {item.quantity} шт., {formatUzs(item.lineTotal)}
          </li>
        ))}
      </ul>
      <p className="mt-4 tabular-nums text-ink">Сумма товаров {formatUzs(order.subtotal)}</p>
      <Link href={`/account/orders/${order.number}`} className="mt-6 inline-block text-accent">
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
