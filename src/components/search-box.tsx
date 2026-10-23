"use client"

import { MagnifyingGlass } from "@phosphor-icons/react"
import { Button } from "@/components/button"

type SearchBoxProps = {
  id: string
  defaultQuery?: string
}

export function SearchBox({ id, defaultQuery = "" }: SearchBoxProps) {
  return (
    <form action="/catalog" method="get" role="search" className="flex min-w-0 gap-2">
      <label htmlFor={id} className="sr-only">
        Поиск по названию, бренду или артикулу
      </label>
      <div className="relative min-w-0 flex-1">
        <MagnifyingGlass
          size={16}
          className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted"
          aria-hidden
        />
        <input
          id={id}
          name="q"
          defaultValue={defaultQuery}
          placeholder="Название, бренд или артикул"
          className="h-11 w-full min-w-0 rounded-[10px] border border-line/80 bg-surface/70 pr-4 pl-10 text-sm text-ink transition-[border-color,background-color,box-shadow] duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] placeholder:text-muted hover:border-line focus:border-accent/50 focus:bg-surface-raised focus:shadow-[0_0_0_3px_rgb(198_224_86/0.16)] focus:outline-none"
        />
      </div>
      <Button type="submit">Найти</Button>
    </form>
  )
}
