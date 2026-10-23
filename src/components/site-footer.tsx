import Link from "next/link"
import { storeDraft } from "@/data/store"

const links = [
  ["/catalog", "Каталог"],
  ["/delivery", "Доставка"],
  ["/payment", "Оплата"],
  ["/contacts", "Контакты"],
  ["/about", "О магазине"],
] as const

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line/80 bg-surface/30">
      <div className="mx-auto grid max-w-[1400px] gap-8 px-4 py-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="text-lg font-semibold text-ink">VOLT STORE</p>
          <p className="mt-3 max-w-[42ch] text-sm leading-relaxed text-muted">
            Демонстрационные контакты и доставка. Эти данные не являются офертой.
          </p>
          <nav aria-label="Страницы" className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {links.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="text-ink transition-colors duration-[280ms] hover:text-accent"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="text-sm leading-relaxed text-muted">
          <p className="text-ink">Контакты, черновик</p>
          <p className="mt-3">{storeDraft.address}</p>
          <p>{storeDraft.phone}</p>
          <p>{storeDraft.email}</p>
          <p>{storeDraft.hours}</p>
        </div>
        <div className="text-sm leading-relaxed text-muted">
          <p className="text-ink">Доставка и оплата, черновик</p>
          <p className="mt-3">{storeDraft.delivery}</p>
          <p className="mt-3">{storeDraft.payment}</p>
        </div>
      </div>
    </footer>
  )
}
