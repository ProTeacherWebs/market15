import Image from "next/image"
import Link from "next/link"
import { Reveal } from "@/components/reveal"
import { categories, countLabel, formatUzs, products } from "@/data/catalog"

export default function Home() {
  const active = products.filter((product) => product.isActive)
  const featured = active.filter((product) => product.isFeatured).slice(0, 4)
  const [lead, ...rest] = featured

  return (
    <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-8">
      <Reveal>
        <h1 className="max-w-[16ch] text-4xl leading-[1.05] font-semibold tracking-tight text-ink md:text-6xl">
          Техника для дома в Ташкенте
        </h1>
        <p className="mt-4 max-w-[42ch] text-base leading-relaxed text-muted">
          Холодильники, стиральные машины и кухня. Цены в сумах. В каталоге{" "}
          {countLabel(active.length)}.
        </p>
        <Link
          href="/catalog"
          className="mt-6 inline-flex h-11 items-center rounded-full bg-accent px-5 text-sm font-medium text-accent-ink transition-[transform,background-color,box-shadow] duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px hover:bg-[#d4ec6e] hover:shadow-[0_10px_24px_rgb(198_224_86/0.22)] active:scale-[0.98]"
        >
          Открыть каталог
        </Link>
      </Reveal>
      {lead ? (
        <section className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-4" aria-label="Подборка">
          <Reveal className="lg:col-span-2 lg:row-span-2" delay={0.05}>
            <Link
              href={`/product/${lead.slug}`}
              className="group block overflow-hidden rounded-[16px] border border-line/80 bg-surface transition-[border-color,box-shadow,transform] duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-accent/35 hover:shadow-[0_18px_40px_rgb(0_0_0/0.28)]"
            >
              <div className="relative aspect-[4/5] bg-white lg:aspect-[4/3] lg:min-h-[420px]">
                {lead.images[0] ? (
                  <div className="absolute inset-6">
                    <Image
                      src={lead.images[0].url}
                      alt={lead.images[0].alt}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-contain transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                    />
                  </div>
                ) : null}
              </div>
              <div className="p-5">
                <p className="text-sm text-muted">{lead.brand}</p>
                <h2 className="mt-1 text-2xl text-ink transition-colors duration-[280ms] group-hover:text-accent">
                  {lead.name}
                </h2>
                <p className="mt-2 text-sm text-muted">
                  {lead.stockQuantity > 0 ? `В наличии, ${lead.stockQuantity} шт.` : "Нет в наличии"}
                </p>
                <p className="mt-3 text-lg tabular-nums text-ink">{formatUzs(lead.priceUzs)}</p>
              </div>
            </Link>
          </Reveal>
          {rest.map((product, index) => (
            <Reveal key={product.id} className="lg:col-span-2" delay={0.08 + index * 0.05}>
              <Link
                href={`/product/${product.slug}`}
                className="group block overflow-hidden rounded-[16px] border border-line/80 bg-surface transition-[border-color,box-shadow,transform] duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-accent/35 hover:shadow-[0_18px_40px_rgb(0_0_0/0.28)]"
              >
                <div className="grid sm:grid-cols-[140px_1fr]">
                  <div className="relative aspect-[4/3] bg-white sm:aspect-auto sm:min-h-36">
                    {product.images[0] ? (
                      <div className="absolute inset-2">
                        <Image
                          src={product.images[0].url}
                          alt={product.images[0].alt}
                          fill
                          sizes="200px"
                          className="object-contain transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                        />
                      </div>
                    ) : null}
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-muted">{product.brand}</p>
                    <h2 className="mt-1 text-lg text-ink transition-colors duration-[280ms] group-hover:text-accent">
                      {product.name}
                    </h2>
                    <p className="mt-2 text-sm text-muted">
                      {product.stockQuantity > 0
                        ? `В наличии, ${product.stockQuantity} шт.`
                        : "Нет в наличии"}
                    </p>
                    <p className="mt-2 tabular-nums text-ink">{formatUzs(product.priceUzs)}</p>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </section>
      ) : null}
      <Reveal delay={0.12}>
        <nav aria-label="Категории" className="mt-10 flex flex-wrap gap-2">
          {categories.map((category) => {
            const count = active.filter((product) => product.categoryId === category.id).length
            return (
              <Link
                key={category.id}
                href={`/catalog/${category.slug}`}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-line/80 px-4 text-sm text-ink transition-[border-color,background-color,transform,color] duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-accent/40 hover:bg-surface-raised hover:text-accent active:scale-[0.98]"
              >
                {category.name}
                <span className="tabular-nums text-muted">{count}</span>
              </Link>
            )
          })}
        </nav>
      </Reveal>
    </main>
  )
}
