import Image from "next/image"
import Link from "next/link"
import { countLabel, formatUzs } from "@/data/catalog"
import { listActiveCategories, listActiveProducts } from "@/db/catalog"

export default async function TgHomePage() {
  const [categories, products] = await Promise.all([
    listActiveCategories(),
    listActiveProducts(),
  ])
  const featured = products.filter((product) => product.isFeatured).slice(0, 4)

  return (
    <main className="mx-auto w-full max-w-lg px-4 py-6">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">VOLT STORE</h1>
      <p className="mt-2 text-sm text-muted">
        Тот же каталог, что на сайте. В каталоге {countLabel(products.length)}.
      </p>
      <Link
        href="/tg/catalog"
        className="mt-5 inline-flex h-11 items-center rounded-full bg-accent px-5 text-sm font-medium text-accent-ink"
      >
        Открыть каталог
      </Link>

      <section className="mt-8 grid gap-3" aria-label="Подборка">
        {featured.map((product) => {
          const image = product.images[0]
          return (
            <Link
              key={product.id}
              href={`/tg/product/${product.slug}`}
              className="grid grid-cols-[88px_1fr] gap-3 rounded-[16px] border border-line/80 bg-surface p-3"
            >
              <div className="relative aspect-square overflow-hidden rounded-[10px] bg-white">
                {image ? (
                  <Image src={image.url} alt={image.alt} fill sizes="88px" className="object-contain" />
                ) : null}
              </div>
              <div>
                <p className="text-xs text-muted">{product.brand}</p>
                <p className="mt-1 text-sm text-ink">{product.name}</p>
                <p className="mt-2 text-sm tabular-nums text-ink">{formatUzs(product.priceUzs)}</p>
              </div>
            </Link>
          )
        })}
      </section>

      <nav aria-label="Категории" className="mt-8 flex flex-wrap gap-2">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/tg/catalog/${category.slug}`}
            className="inline-flex h-9 items-center rounded-full border border-line/80 px-3 text-sm text-ink"
          >
            {category.name}
          </Link>
        ))}
      </nav>
    </main>
  )
}
