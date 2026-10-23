"use client"

import { Heart, Scales, ShoppingBag } from "@phosphor-icons/react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useState } from "react"
import { Button } from "@/components/button"
import { useShop } from "@/components/shop-provider"

export function CardActions({
  productId,
  inStock,
  quantity = 1,
}: {
  productId: string
  inStock: boolean
  quantity?: number
}) {
  const shop = useShop()
  const favorite = shop.favorites.includes(productId)
  const compared = shop.compare.includes(productId)
  const inCart = shop.cart.some((line) => line.productId === productId)
  const [message, setMessage] = useState<string | null>(null)
  const [pulse, setPulse] = useState(false)
  const reduce = useReducedMotion()

  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-2">
        <motion.button
          type="button"
          aria-pressed={favorite}
          aria-label={favorite ? "Убрать из избранного" : "В избранное"}
          whileTap={reduce ? undefined : { scale: 0.9 }}
          className={`inline-flex size-11 items-center justify-center rounded-full border transition-[border-color,background-color,color] duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            favorite
              ? "border-accent/45 bg-accent/10 text-accent"
              : "border-line/80 text-ink hover:border-accent/35 hover:bg-surface-raised"
          }`}
          onClick={() => shop.toggleFavorite(productId)}
        >
          <Heart size={18} weight={favorite ? "fill" : "regular"} />
        </motion.button>
        <motion.button
          type="button"
          aria-pressed={compared}
          aria-label={compared ? "Убрать из сравнения" : "Сравнить"}
          whileTap={reduce ? undefined : { scale: 0.9 }}
          className={`inline-flex size-11 items-center justify-center rounded-full border transition-[border-color,background-color,color] duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            compared
              ? "border-accent/45 bg-accent/10 text-accent"
              : "border-line/80 text-ink hover:border-accent/35 hover:bg-surface-raised"
          }`}
          onClick={() => setMessage(shop.toggleCompare(productId))}
        >
          <Scales size={18} weight={compared ? "fill" : "regular"} />
        </motion.button>
        <Button
          type="button"
          disabled={!inStock}
          className="relative flex-1 overflow-hidden"
          onClick={() => {
            shop.addToCart(productId, quantity)
            if (!reduce) {
              setPulse(true)
              window.setTimeout(() => setPulse(false), 420)
            }
          }}
        >
          <AnimatePresence>
            {pulse ? (
              <motion.span
                className="pointer-events-none absolute inset-0 bg-white/25"
                initial={{ opacity: 0.35 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.42 }}
              />
            ) : null}
          </AnimatePresence>
          <ShoppingBag size={18} />
          {inStock ? (inCart ? "В корзине" : "В корзину") : "Нет в наличии"}
        </Button>
      </div>
      <AnimatePresence>
        {message ? (
          <motion.p
            role="status"
            initial={reduce ? false : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -4 }}
            className="text-sm text-danger"
          >
            {message}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
