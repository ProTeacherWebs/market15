"use client"

import Image from "next/image"
import Link from "next/link"
import { useAppHref } from "@/components/link-base"
import { useShop } from "@/components/shop-provider"
import { formatUzs, products } from "@/data/catalog"

export default function CartPage() {
  const shop = useShop()
  const catalogHref = useAppHref("/catalog")
  const checkoutHref = useAppHref("/checkout")
  const pathPrefix = catalogHref.endsWith("/catalog")
    ? catalogHref.slice(0, -"/catalog".length)
    : ""
  const lines = shop.cart.flatMap((line) => {
    const product = products.find((item) => item.id === line.productId && item.isActive)
    if (!product) return []
    const quantity = Math.min(line.quantity, Math.max(product.stockQuantity, 0))
    return [{ product, quantity, lineTotal: product.priceUzs * quantity }]
  })
  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0)

  return (
    <main className="mx-auto w-full max-w-[960px] px-4 py-8">
      <h1 className="text-3xl font-semibold text-ink md:text-5xl">Корзина</h1>
      {!shop.ready ? (
        <p className="mt-8 text-muted">Загрузка корзины.</p>
      ) : lines.length === 0 ? (
        <p className="mt-8 text-ink">
          Корзина пуста. Перейдите в{" "}
          <Link href={catalogHref} className="text-accent">
            каталог
          </Link>
          .
        </p>
      ) : (
        <div className="mt-8 grid gap-6">
          {lines.map(({ product, quantity, lineTotal }) => {
            const image = product.images[0]
            return (
              <div key={product.id} className="grid grid-cols-[96px_1fr] gap-4 border-b border-line pb-6">
                <Link
                  href={`${pathPrefix}/product/${product.slug}`}
                  className="relative block aspect-square overflow-hidden rounded-[10px] bg-white"
                >
                  {image ? (
                    <Image src={image.url} alt={image.alt} fill sizes="96px" className="object-contain" />
                  ) : null}
                </Link>
                <div>
                  <Link href={`${pathPrefix}/product/${product.slug}`} className="text-ink">
                    {product.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted">{formatUzs(product.priceUzs)}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <label className="text-sm text-muted">
                      Количество
                      <input
                        type="number"
                        min={1}
                        max={product.stockQuantity}
                        value={quantity}
                        onChange={(event) => shop.setQuantity(product.id, Number(event.target.value))}
                        className="ml-2 h-11 w-20 rounded-[10px] border border-line bg-surface px-3 text-ink"
                      />
                    </label>
                    <p className="tabular-nums text-ink">{formatUzs(lineTotal)}</p>
                    <button type="button" className="text-sm text-accent" onClick={() => shop.removeFromCart(product.id)}>
                      Удалить
                    </button>
                  </div>
                  {product.stockQuantity < 1 ? (
                    <p className="mt-2 text-sm text-danger">Товара нет в наличии.</p>
                  ) : null}
                </div>
              </div>
            )
          })}
          <div className="grid gap-2 text-sm">
            <p className="flex justify-between text-ink">
              <span>Сумма товаров</span>
              <span className="tabular-nums">{formatUzs(subtotal)}</span>
            </p>
            <p className="flex justify-between text-muted">
              <span>Доставка</span>
              <span>Уточняется, в итог не входит</span>
            </p>
          </div>
          <Link
            href={checkoutHref}
            className="inline-flex h-11 w-fit items-center rounded-full bg-accent px-5 text-sm font-medium text-accent-ink"
          >
            Оформить
          </Link>
        </div>
      )}
    </main>
  )
}
