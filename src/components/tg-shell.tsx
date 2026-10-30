"use client"

import {
  Heart,
  House,
  ShoppingBag,
  SquaresFour,
  User,
} from "@phosphor-icons/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { useShop } from "@/components/shop-provider"

const tabs = [
  { href: "/tg", label: "Главная", icon: House, match: (path: string) => path === "/tg" },
  {
    href: "/tg/catalog",
    label: "Каталог",
    icon: SquaresFour,
    match: (path: string) => path.startsWith("/tg/catalog") || path.startsWith("/tg/product"),
  },
  {
    href: "/tg/favorites",
    label: "Избранное",
    icon: Heart,
    match: (path: string) => path.startsWith("/tg/favorites"),
  },
  {
    href: "/tg/cart",
    label: "Корзина",
    icon: ShoppingBag,
    match: (path: string) => path.startsWith("/tg/cart") || path.startsWith("/tg/checkout"),
  },
  {
    href: "/tg/account",
    label: "Аккаунт",
    icon: User,
    match: (path: string) => path.startsWith("/tg/account"),
  },
] as const

export function TgShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const shop = useShop()

  return (
    <div className="flex min-h-full flex-1 flex-col pb-20">
      <header className="sticky top-0 z-40 border-b border-line/80 bg-canvas/90 px-4 py-3 backdrop-blur-md">
        <p className="text-sm font-semibold tracking-tight text-ink">
          VOLT <span className="font-normal text-muted">Mini App</span>
        </p>
      </header>
      <div className="flex-1">{children}</div>
      <nav
        aria-label="Меню Mini App"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line/80 bg-canvas/95 backdrop-blur-md"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-5">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const active = tab.match(pathname)
            const count = tab.href === "/tg/cart" ? shop.cartCount : undefined
            return (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex flex-col items-center gap-1 px-1 py-2 text-[10px] ${
                    active ? "text-accent" : "text-muted"
                  }`}
                >
                  <Icon size={22} weight={active ? "fill" : "regular"} />
                  {tab.label}
                  {count ? (
                    <span className="absolute top-1 right-3 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] text-accent-ink">
                      {count}
                    </span>
                  ) : null}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
