"use client"

import Link from "next/link"

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-16">
      <h1 className="text-3xl font-semibold text-ink">Страница не открылась</h1>
      <p className="mt-3 text-muted">Обновите её или вернитесь в каталог.</p>
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-11 items-center rounded-full bg-accent px-5 text-sm font-medium text-accent-ink"
        >
          Обновить
        </button>
        <Link
          href="/catalog"
          className="inline-flex h-11 items-center rounded-full border border-line px-5 text-sm text-ink"
        >
          В каталог
        </Link>
      </div>
    </div>
  )
}
