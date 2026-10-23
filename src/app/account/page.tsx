"use client"

import Link from "next/link"
import { signOut } from "next-auth/react"
import { formatUzs } from "@/data/catalog"
import { useShop } from "@/components/shop-provider"

export default function AccountPage() {
  const shop = useShop()

  return (
    <main className="mx-auto w-full max-w-[720px] px-4 py-8">
      <h1 className="text-3xl font-semibold text-ink">Аккаунт</h1>
      {!shop.ready ? (
        <p className="mt-8 text-muted">Загрузка аккаунта.</p>
      ) : shop.user ? (
        <div className="mt-6">
          <p className="text-ink">{shop.user.name}</p>
          <p className="text-muted">{shop.user.email}</p>
          <button
            type="button"
            className="mt-3 text-sm text-accent"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Выйти
          </button>
        </div>
      ) : (
        <p className="mt-6 text-ink">
          <Link href="/login" className="text-accent">
            Войти
          </Link>{" "}
          или{" "}
          <Link href="/register" className="text-accent">
            зарегистрироваться
          </Link>
          .
        </p>
      )}
      <h2 className="mt-10 text-xl text-ink">Заказы</h2>
      {!shop.user ? (
        <p className="mt-4 text-sm text-muted">Заказы видны после входа.</p>
      ) : shop.orders.length === 0 ? (
        <p className="mt-4 text-sm text-muted">Заказов пока нет.</p>
      ) : (
        <ul className="mt-4 grid gap-3">
          {shop.orders.map((order) => (
            <li key={order.number} className="rounded-[16px] border border-line p-4">
              <Link href={`/account/orders/${order.number}`} className="text-ink">
                {order.number}
              </Link>
              <p className="mt-1 text-sm text-muted">
                {formatUzs(order.subtotal)}. Оплата: {order.paymentStatus}.
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
