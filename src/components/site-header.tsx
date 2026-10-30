"use client"

import { Heart, List, Scales, ShoppingBag, User, X } from "@phosphor-icons/react"
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState, type ReactNode } from "react"
import { SearchBox } from "@/components/search-box"
import { useShop } from "@/components/shop-provider"
import { categories } from "@/data/catalog"

function IconLink({
  href,
  label,
  count,
  active,
  reduce,
  children,
}: {
  href: string
  label: string
  count?: number
  active?: boolean
  reduce: boolean | null
  children: ReactNode
}) {
  return (
    <motion.div whileHover={reduce ? undefined : { y: -2 }} whileTap={reduce ? undefined : { scale: 0.94 }}>
      <Link
        href={href}
        aria-label={count ? `${label}, ${count}` : label}
        aria-current={active ? "page" : undefined}
        className={`relative inline-flex size-11 items-center justify-center rounded-full border transition-[border-color,background-color,color,box-shadow] duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          active
            ? "border-accent/50 bg-accent/10 text-accent shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]"
            : "border-line/80 bg-surface/40 text-ink hover:border-accent/35 hover:bg-surface-raised hover:text-accent"
        }`}
      >
        {children}
        <AnimatePresence>
          {count ? (
            <motion.span
              key={count}
              initial={reduce ? false : { scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reduce ? undefined : { scale: 0.6, opacity: 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 22 }}
              className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-medium text-accent-ink"
            >
              {count}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </Link>
    </motion.div>
  )
}

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const reduce = useReducedMotion()
  const params = useSearchParams()
  const pathname = usePathname()
  const query = params.get("q") ?? ""
  const shop = useShop()
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (value) => {
    setScrolled(value > 12)
  })

  if (pathname.startsWith("/tg")) return null

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = previous
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <header
      className={`sticky top-0 z-[var(--z-header)] border-b transition-[background-color,border-color,backdrop-filter,box-shadow] duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        scrolled || open
          ? "border-line/80 bg-canvas/80 shadow-[0_12px_40px_rgb(0_0_0/0.28)] backdrop-blur-xl"
          : "border-transparent bg-canvas/55 backdrop-blur-md"
      }`}
    >
      <div className="relative">
        <div
          className={`mx-auto flex max-w-[1400px] items-center gap-3 px-4 transition-[height] duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            scrolled ? "h-14" : "h-16"
          }`}
        >
          <Link
            href="/"
            className="group shrink-0 text-lg font-semibold tracking-tight text-ink"
            onClick={close}
          >
            VOLT
            <span className="ml-1 font-normal text-muted transition-colors duration-[280ms] group-hover:text-accent">
              STORE
            </span>
          </Link>
          <div className="hidden min-w-0 flex-1 md:block">
            <SearchBox id="search-desktop" defaultQuery={query} />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center gap-2 md:flex">
              <IconLink
                href="/favorites"
                label="Избранное"
                count={shop.favorites.length}
                active={pathname === "/favorites"}
                reduce={reduce}
              >
                <Heart size={18} weight={pathname === "/favorites" ? "fill" : "regular"} />
              </IconLink>
              <IconLink
                href="/compare"
                label="Сравнение"
                count={shop.compare.length}
                active={pathname === "/compare"}
                reduce={reduce}
              >
                <Scales size={18} weight={pathname === "/compare" ? "fill" : "regular"} />
              </IconLink>
              <IconLink
                href="/cart"
                label="Корзина"
                count={shop.cartCount}
                active={pathname === "/cart"}
                reduce={reduce}
              >
                <ShoppingBag size={18} weight={pathname === "/cart" ? "fill" : "regular"} />
              </IconLink>
              <IconLink href="/account" label="Аккаунт" active={pathname.startsWith("/account")} reduce={reduce}>
                <User size={18} weight={pathname.startsWith("/account") ? "fill" : "regular"} />
              </IconLink>
            </div>
            <span className="md:hidden">
              <IconLink
                href="/cart"
                label="Корзина"
                count={shop.cartCount}
                active={pathname === "/cart"}
                reduce={reduce}
              >
                <ShoppingBag size={18} weight={pathname === "/cart" ? "fill" : "regular"} />
              </IconLink>
            </span>
            <motion.button
              type="button"
              whileTap={reduce ? undefined : { scale: 0.96 }}
              className={`inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm transition-[border-color,background-color,color] duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                open
                  ? "border-accent/50 bg-accent text-accent-ink"
                  : "border-line/80 bg-surface/40 text-ink hover:border-accent/35 hover:bg-surface-raised"
              }`}
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X size={18} /> : <List size={18} />}
              <span className="hidden sm:inline">{open ? "Закрыть" : "Меню"}</span>
            </motion.button>
          </div>
        </div>
        <div className="mx-auto max-w-[1400px] px-4 pb-3 md:hidden">
          <SearchBox id="search-mobile" defaultQuery={query} />
        </div>
        <AnimatePresence>
          {open ? (
            <>
              <motion.button
                type="button"
                aria-label="Закрыть меню"
                className="fixed inset-0 z-[calc(var(--z-menu)-1)] bg-canvas/55 backdrop-blur-[2px]"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.2 }}
                onClick={close}
              />
              <motion.div
                id="site-menu"
                className="absolute inset-x-0 top-full z-[var(--z-menu)] border-b border-line/80 bg-surface/95 shadow-[0_24px_60px_rgb(0_0_0/0.35)] backdrop-blur-xl"
                initial={reduce ? false : { opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: reduce ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                <nav aria-label="Разделы" className="mx-auto max-w-[1400px] px-4 py-5">
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    <Link
                      href="/catalog"
                      onClick={close}
                      className="group flex items-center justify-between rounded-[16px] border border-line/70 bg-canvas/40 px-4 py-4 transition-[border-color,background-color,transform] duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-accent/40 hover:bg-surface-raised"
                    >
                      <span className="text-sm font-medium text-ink">Весь каталог</span>
                      <span className="text-sm text-muted transition-colors group-hover:text-accent">Открыть</span>
                    </Link>
                    {categories.map((item, index) => {
                      const active = pathname === `/catalog/${item.slug}`
                      return (
                        <motion.div
                          key={item.slug}
                          initial={reduce ? false : { opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: reduce ? 0 : 0.28,
                            delay: reduce ? 0 : 0.03 * index,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        >
                          <Link
                            href={`/catalog/${item.slug}`}
                            onClick={close}
                            aria-current={active ? "page" : undefined}
                            className={`group grid grid-cols-[56px_1fr] items-center gap-3 rounded-[16px] border px-3 py-3 transition-[border-color,background-color,transform] duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 ${
                              active
                                ? "border-accent/45 bg-accent/10"
                                : "border-line/70 bg-canvas/30 hover:border-accent/35 hover:bg-surface-raised"
                            }`}
                          >
                            <span className="relative size-14 overflow-hidden rounded-[12px] bg-white">
                              <Image
                                src={item.imageUrl}
                                alt=""
                                fill
                                sizes="56px"
                                className="object-contain p-1 transition-transform duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                              />
                            </span>
                            <span>
                              <span className="block text-sm font-medium text-ink">{item.name}</span>
                              <span className="mt-0.5 block text-xs text-muted">{item.description}</span>
                            </span>
                          </Link>
                        </motion.div>
                      )
                    })}
                  </div>
                  <div className="mt-4 grid gap-2 border-t border-line/70 pt-4 md:hidden">
                    {[
                      ["/favorites", "Избранное", shop.favorites.length],
                      ["/compare", "Сравнение", shop.compare.length],
                      ["/account", "Аккаунт", undefined],
                    ].map(([href, label, count]) => (
                      <Link
                        key={href as string}
                        href={href as string}
                        onClick={close}
                        className="flex items-center justify-between rounded-[12px] px-3 py-3 text-sm text-ink transition-colors hover:bg-surface-raised"
                      >
                        <span>{label as string}</span>
                        {typeof count === "number" && count > 0 ? (
                          <span className="tabular-nums text-accent">{count}</span>
                        ) : null}
                      </Link>
                    ))}
                  </div>
                </nav>
              </motion.div>
            </>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  )
}
