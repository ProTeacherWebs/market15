"use client"

import { motion, useReducedMotion } from "motion/react"
import Image from "next/image"
import Link from "next/link"
import { CardActions } from "@/components/card-actions"
import { formatUzs, type Product } from "@/data/catalog"

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0]
  const inStock = product.stockQuantity > 0
  const reduce = useReducedMotion()

  return (
    <motion.article
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className="group flex h-full flex-col overflow-hidden rounded-[16px] border border-line/80 bg-surface transition-[border-color,box-shadow] duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-accent/35 hover:shadow-[0_18px_40px_rgb(0_0_0/0.28)]"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] bg-white">
          {image ? (
            <div className="absolute inset-3">
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-contain transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
              />
            </div>
          ) : null}
        </div>
        <div className="grid gap-2 p-4 pb-0">
          <p className="text-sm text-muted">{product.brand}</p>
          <h2 className="text-base leading-snug text-ink transition-colors duration-[280ms] group-hover:text-accent">
            {product.name}
          </h2>
          <p className="text-sm text-muted">
            {inStock ? `В наличии, ${product.stockQuantity} шт.` : "Нет в наличии"}
          </p>
          <p className="text-lg font-medium tabular-nums text-ink">
            {formatUzs(product.priceUzs)}
            {product.oldPriceUzs ? (
              <span className="ml-2 text-sm font-normal text-muted line-through">
                {formatUzs(product.oldPriceUzs)}
              </span>
            ) : null}
          </p>
        </div>
      </Link>
      <div className="p-4">
        <CardActions productId={product.id} inStock={inStock} />
      </div>
    </motion.article>
  )
}
