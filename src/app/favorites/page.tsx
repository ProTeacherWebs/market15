"use client"

import Link from "next/link"
import { ProductCard } from "@/components/product-card"
import { useShop } from "@/components/shop-provider"
import { products } from "@/data/catalog"

export default function FavoritesPage() {
  const shop = useShop()
  const items = shop.favorites
    .map((id) => products.find((product) => product.id === id))
    .filter((product) => product !== undefined)

  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-8">
      <h1 className="text-3xl font-semibold text-ink md:text-5xl">Избранное</h1>
      <p className="mt-3 text-muted">Список хранится в этом браузере и не дублируется.</p>
      {!shop.ready ? (
        <p className="mt-8 text-muted">Загрузка списка.</p>
      ) : items.length === 0 ? (
        <p className="mt-8 text-ink">
          Пока пусто. Отметьте товар в{" "}
          <Link href="/catalog" className="text-accent">
            каталоге
          </Link>
          .
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  )
}
