"use client"

import Link from "next/link"
import { compareLimit, formatUzs, products } from "@/data/catalog"
import { useShop } from "@/components/shop-provider"

export default function ComparePage() {
  const shop = useShop()
  const items = shop.compare
    .map((id) => products.find((product) => product.id === id && product.isActive))
    .filter((product) => product !== undefined)
  const names = [...new Set(items.flatMap((product) => product.attributes.map((item) => item.name)))]

  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-ink md:text-5xl">Сравнение</h1>
          <p className="mt-3 text-muted">До {compareLimit} товаров одной категории.</p>
        </div>
        {items.length > 0 ? (
          <button type="button" onClick={shop.clearCompare} className="text-sm text-accent">
            Очистить
          </button>
        ) : null}
      </div>
      {items.length === 0 ? (
        <p className="mt-8 text-ink">
          Список пуст. Добавьте товар кнопкой сравнения в{" "}
          <Link href="/catalog" className="text-accent">
            каталоге
          </Link>
          .
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr>
                <th className="p-3 text-muted"> </th>
                {items.map((product) => (
                  <th key={product.id} className="border-b border-line p-3 font-medium text-ink">
                    <Link href={`/product/${product.slug}`}>{product.name}</Link>
                    <button
                      type="button"
                      className="mt-2 block text-accent"
                      onClick={() => shop.removeCompare(product.id)}
                    >
                      Убрать
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="p-3 font-normal text-muted">Цена</th>
                {items.map((product) => (
                  <td key={product.id} className="border-t border-line p-3 tabular-nums text-ink">
                    {formatUzs(product.priceUzs)}
                  </td>
                ))}
              </tr>
              {names.map((name) => (
                <tr key={name}>
                  <th className="p-3 font-normal text-muted">{name}</th>
                  {items.map((product) => {
                    const attribute = product.attributes.find((item) => item.name === name)
                    return (
                      <td key={product.id} className="border-t border-line p-3 text-ink">
                        {attribute
                          ? `${attribute.value}${attribute.unit ? ` ${attribute.unit}` : ""}`
                          : "---"}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
