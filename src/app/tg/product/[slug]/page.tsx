import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { PurchasePanel } from "@/components/purchase-panel"
import { formatUzs, similarProducts } from "@/data/catalog"
import { findProductBySlug, listActiveProducts } from "@/db/catalog"

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function TgProductPage({ params }: PageProps) {
  const { slug } = await params
  const product = await findProductBySlug(slug)
  if (!product) notFound()
  const all = await listActiveProducts()
  const similar = similarProducts(product, all).slice(0, 4)
  const image = product.images[0]

  return (
    <main className="mx-auto w-full max-w-lg px-4 py-6">
      <Link href="/tg/catalog" className="text-sm text-accent">
        ← Каталог
      </Link>
      <div className="relative mt-4 aspect-[4/5] overflow-hidden rounded-[16px] bg-white">
        {image ? (
          <div className="absolute inset-4">
            <Image src={image.url} alt={image.alt} fill sizes="100vw" className="object-contain" />
          </div>
        ) : null}
      </div>
      <p className="mt-4 text-sm text-muted">{product.brand}</p>
      <h1 className="mt-1 text-2xl font-semibold text-ink">{product.name}</h1>
      <p className="mt-2 text-sm text-muted">
        {product.stockQuantity > 0
          ? `В наличии, ${product.stockQuantity} шт.`
          : "Нет в наличии"}
      </p>
      <p className="mt-3 text-xl tabular-nums text-ink">{formatUzs(product.priceUzs)}</p>
      <p className="mt-4 text-sm leading-relaxed text-muted">{product.shortDescription}</p>
      <div className="mt-6">
        <PurchasePanel productId={product.id} stock={product.stockQuantity} />
      </div>
      {similar.length ? (
        <section className="mt-10">
          <h2 className="text-lg text-ink">Похожие</h2>
          <div className="mt-4 grid gap-3">
            {similar.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  )
}
