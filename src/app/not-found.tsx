import Link from "next/link"

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-16">
      <h1 className="text-3xl font-semibold text-ink">Страница не найдена</h1>
      <p className="mt-3 text-muted">Проверьте адрес или откройте каталог.</p>
      <Link
        href="/catalog"
        className="mt-6 inline-flex h-11 items-center rounded-full bg-accent px-5 text-sm font-medium text-accent-ink"
      >
        В каталог
      </Link>
    </div>
  )
}
