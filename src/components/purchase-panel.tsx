"use client"

import { useState } from "react"
import { CardActions } from "@/components/card-actions"

export function PurchasePanel({
  productId,
  stock,
}: {
  productId: string
  stock: number
}) {
  const [quantity, setQuantity] = useState(1)
  const inStock = stock > 0

  return (
    <div className="grid max-w-md gap-4">
      <label className="grid max-w-28 gap-2 text-sm text-ink">
        Количество
        <input
          type="number"
          min={1}
          max={Math.max(stock, 1)}
          value={inStock ? quantity : 0}
          disabled={!inStock}
          onChange={(event) => {
            const next = Number(event.target.value)
            if (!Number.isFinite(next)) return
            setQuantity(Math.min(stock, Math.max(1, Math.floor(next))))
          }}
          className="h-11 rounded-[10px] border border-line bg-surface px-3 text-ink"
        />
      </label>
      <CardActions productId={productId} inStock={inStock} quantity={quantity} />
    </div>
  )
}
