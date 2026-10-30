import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { PurchasePanel } from "@/components/purchase-panel"
import { categoryById, formatUzs, similarProducts } from "@/data/catalog"
import {
  findProductBySlug,
  listActiveCategories,
  listActiveProducts,
  listProductSlugs,
} from "@/db/catalog"

export async function generateStaticParams() {
  try {
    const slugs = await listProductSlugs()
    return slugs.map((slug) => ({ slug }))
  } catch {
    return []
  }
}

export const dynamicParams = true

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await findProductBySlug(slug)
  if (!product) notFound()
  const image = product.images[0]?.url
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: image ? [{ url: image, alt: product.images[0]?.alt || product.name }] : undefined,
    },
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const [product, categories, products] = await Promise.all([
    findProductBySlug(slug),
    listActiveCategories(),
    listActiveProducts(),
  ])
  if (!product) notFound()
  const category = categoryById(product.categoryId, categories)
  const image = product.images[0]
  const related = similarProducts(product, products)

  return (
    <article className="mx-auto w-full max-w-[1400px] px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[16px] border border-line bg-white">
          {image ? (
            <div className="absolute inset-6">
              <Image
                src={image.url}
                alt={image.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain"
              />
            </div>
          ) : null}
        </div>
        <div>
          <p className="text-sm text-muted">{product.brand}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-4 max-w-[52ch] text-muted">{product.description}</p>
          <p className="mt-4 text-sm text-muted">Артикул {product.sku}</p>
          <p className="mt-2 text-sm text-muted">
            {product.stockQuantity > 0
              ? `В наличии, ${product.stockQuantity} шт.`
              : "Нет в наличии"}
          </p>
          {category ? <p className="mt-2 text-sm text-muted">{category.name}</p> : null}
          <p className="mt-6 text-3xl font-medium tabular-nums text-ink">
            {formatUzs(product.priceUzs)}
            {product.oldPriceUzs ? (
              <span className="ml-3 text-lg font-normal text-muted line-through">
                {formatUzs(product.oldPriceUzs)}
              </span>
            ) : null}
          </p>
          <div className="mt-6">
            <PurchasePanel productId={product.id} stock={product.stockQuantity} />
          </div>
          <dl className="mt-8 grid gap-3 sm:grid-cols-2">
            {product.attributes.map((attribute) => (
              <div key={attribute.id} className="rounded-[16px] border border-line p-4">
                <dt className="text-sm text-muted">{attribute.name}</dt>
                <dd className="mt-1 text-lg text-ink">
                  {attribute.value}
                  {attribute.unit ? ` ${attribute.unit}` : ""}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      {related.length > 0 ? (
        <section className="mt-14">
          <h2 className="text-2xl font-semibold text-ink">Похожие товары</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  )
}
