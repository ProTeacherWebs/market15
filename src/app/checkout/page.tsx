"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { Field } from "@/components/field"
import { useShop } from "@/components/shop-provider"
import { formatUzs, products } from "@/data/catalog"
import { storeDraft } from "@/data/store"
import { startStripeCheckoutAction } from "@/lib/payment-actions"

type Errors = Partial<Record<"name" | "phone" | "email" | "address", string>>

export default function CheckoutPage() {
  const shop = useShop()
  const router = useRouter()
  const [method, setMethod] = useState<"pickup" | "courier">("pickup")
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState("")
  const [pending, setPending] = useState(false)
  const idempotencyKey = useRef(crypto.randomUUID())

  const lines = shop.cart.flatMap((line) => {
    const product = products.find((item) => item.id === line.productId && item.isActive)
    if (!product || product.stockQuantity < 1) return []
    const quantity = Math.min(line.quantity, product.stockQuantity)
    return [{ name: product.name, quantity, lineTotal: product.priceUzs * quantity }]
  })
  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0)

  async function submit(formData: FormData) {
    const name = String(formData.get("name") ?? "").trim()
    const phone = String(formData.get("phone") ?? "").trim()
    const email = String(formData.get("email") ?? "").trim()
    const address = String(formData.get("address") ?? "").trim()
    const next: Errors = {}
    if (name.length < 2) next.name = "Укажите имя"
    if (phone.replace(/\D/g, "").length < 9) next.phone = "Укажите телефон"
    if (!email.includes("@") || !email.includes(".")) next.email = "Укажите почту"
    if (method === "courier" && address.length < 5) next.address = "Укажите адрес"
    setErrors(next)
    setFormError("")
    if (Object.keys(next).length > 0) return
    setPending(true)
    const result = await shop.placeOrder({
      customerName: name,
      phone,
      email,
      deliveryMethod: method,
      address: method === "courier" ? address : "",
      idempotencyKey: idempotencyKey.current,
    })
    if (!result.ok) {
      setPending(false)
      setFormError(result.error)
      return
    }
    const pay = await startStripeCheckoutAction(result.order.number)
    if (pay.ok) {
      router.push(pay.url)
      return
    }
    setPending(false)
    const message = pay.error ?? "Не удалось открыть Stripe"
    router.push(
      `/checkout/result?order=${encodeURIComponent(result.order.number)}&payError=${encodeURIComponent(message)}`,
    )
  }

  if (!shop.ready) {
    return <p className="mx-auto w-full max-w-[720px] px-4 py-8 text-muted">Загрузка заказа.</p>
  }

  if (!shop.user) {
    return (
      <main className="mx-auto w-full max-w-[720px] px-4 py-8">
        <h1 className="text-3xl font-semibold text-ink">Оформление</h1>
        <p className="mt-4 text-ink">
          Чтобы оформить заказ,{" "}
          <Link href="/login" className="text-accent">
            войдите
          </Link>{" "}
          или{" "}
          <Link href="/register" className="text-accent">
            создайте аккаунт
          </Link>
          . Гостевая корзина перенесётся после входа.
        </p>
      </main>
    )
  }

  if (lines.length === 0) {
    return (
      <main className="mx-auto w-full max-w-[720px] px-4 py-8">
        <h1 className="text-3xl font-semibold text-ink">Оформление</h1>
        <p className="mt-4 text-ink">
          В корзине нет товаров в наличии. Откройте{" "}
          <Link href="/catalog" className="text-accent">
            каталог
          </Link>
          .
        </p>
      </main>
    )
  }

  return (
    <main className="mx-auto grid w-full max-w-[960px] gap-10 px-4 py-8 lg:grid-cols-[1.2fr_0.8fr]">
      <form
        className="grid gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          if (pending) return
          void submit(new FormData(event.currentTarget))
        }}
      >
        <h1 className="text-3xl font-semibold text-ink">Оформление</h1>
        <p className="text-sm text-muted">{storeDraft.payment}</p>
        <Field
          name="name"
          label="Имя"
          autoComplete="name"
          defaultValue={shop.user.name}
          error={errors.name}
        />
        <Field
          name="phone"
          label="Телефон"
          autoComplete="tel"
          hint="Например, +998 90 123 45 67"
          error={errors.phone}
        />
        <Field
          name="email"
          label="Почта"
          type="email"
          autoComplete="email"
          defaultValue={shop.user.email}
          error={errors.email}
        />
        <fieldset className="grid gap-2">
          <legend className="text-sm text-ink">Получение</legend>
          <label className="flex items-center gap-2 text-sm text-muted">
            <input
              type="radio"
              name="delivery"
              checked={method === "pickup"}
              onChange={() => setMethod("pickup")}
            />
            Самовывоз, стоимость не подтверждена
          </label>
          <label className="flex items-center gap-2 text-sm text-muted">
            <input
              type="radio"
              name="delivery"
              checked={method === "courier"}
              onChange={() => setMethod("courier")}
            />
            Доставка по Ташкенту, стоимость не подтверждена
          </label>
        </fieldset>
        {method === "courier" ? (
          <Field name="address" label="Адрес" autoComplete="street-address" error={errors.address} />
        ) : null}
        {formError ? <p className="text-sm text-danger">{formError}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 w-fit items-center rounded-full bg-accent px-5 text-sm font-medium text-accent-ink disabled:bg-surface-raised disabled:text-muted"
        >
          {pending ? "Сохраняем" : "Подтвердить заказ"}
        </button>
      </form>
      <aside className="h-fit rounded-[16px] border border-line p-5">
        <h2 className="text-lg text-ink">Состав</h2>
        <ul className="mt-4 grid gap-3 text-sm">
          {lines.map((line) => (
            <li key={line.name} className="flex justify-between gap-4 text-muted">
              <span>
                {line.name}, {line.quantity} шт.
              </span>
              <span className="tabular-nums text-ink">{formatUzs(line.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex justify-between text-ink">
          <span>Сумма товаров</span>
          <span className="tabular-nums">{formatUzs(subtotal)}</span>
        </p>
        <p className="mt-2 text-sm text-muted">Доставка в сумму не включена.</p>
      </aside>
    </main>
  )
}
