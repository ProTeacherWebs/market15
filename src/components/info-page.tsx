import type { ReactNode } from "react"

export function InfoPage({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <article className="mx-auto w-full max-w-[720px] px-4 py-10">
      <h1 className="text-3xl font-semibold text-ink md:text-5xl">{title}</h1>
      <div className="mt-6 grid gap-4 text-base leading-relaxed text-muted">{children}</div>
    </article>
  )
}
