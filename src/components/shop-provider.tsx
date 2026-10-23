"use client"

import { useSession } from "next-auth/react"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { compareLimit, products, type Product } from "@/data/catalog"
import {
  getAuthenticatedShopState,
  mergeGuestShopState,
  placeOrderAction,
  setCartOnServer,
  setFavoritesOnServer,
  type ShopOrder,
} from "@/lib/shop-actions"

type CartLine = { productId: string; quantity: number }
type ShopUser = { id?: string; name: string; email: string }

type PlaceOrderInput = {
  customerName: string
  email: string
  phone: string
  deliveryMethod: "pickup" | "courier"
  address: string
  idempotencyKey: string
}

type ShopValue = {
  ready: boolean
  cart: CartLine[]
  favorites: string[]
  compare: string[]
  user: ShopUser | null
  orders: ShopOrder[]
  cartCount: number
  addToCart: (productId: string, quantity?: number) => void
  setQuantity: (productId: string, quantity: number) => void
  removeFromCart: (productId: string) => void
  toggleFavorite: (productId: string) => void
  toggleCompare: (productId: string) => string | null
  removeCompare: (productId: string) => void
  clearCompare: () => void
  placeOrder: (
    input: PlaceOrderInput,
  ) => Promise<{ ok: true; order: ShopOrder } | { ok: false; error: string }>
}

const ShopContext = createContext<ShopValue | null>(null)
const storageKey = "volt-shop-guest"

type GuestStored = {
  cart: CartLine[]
  favorites: string[]
  compare: string[]
}

const emptyGuest: GuestStored = {
  cart: [],
  favorites: [],
  compare: [],
}

function readGuest(): GuestStored {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return emptyGuest
    const parsed = JSON.parse(raw) as Partial<GuestStored>
    return {
      cart: Array.isArray(parsed.cart) ? parsed.cart : [],
      favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
      compare: Array.isArray(parsed.compare) ? parsed.compare : [],
    }
  } catch {
    return emptyGuest
  }
}

function writeGuest(next: GuestStored) {
  localStorage.setItem(storageKey, JSON.stringify(next))
}

function productOf(id: string) {
  return products.find((product) => product.id === id && product.isActive)
}

function clampQuantity(product: Product, quantity: number) {
  return Math.min(product.stockQuantity, Math.max(1, Math.floor(quantity)))
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const session = useSession()
  const [guest, setGuest] = useState<GuestStored>(emptyGuest)
  const [cart, setCart] = useState<CartLine[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [orders, setOrders] = useState<ShopOrder[]>([])
  const [hydrated, setHydrated] = useState(false)
  const mergedForUser = useRef<string | null>(null)

  const userId = session.data?.user?.id ?? null
  const ready = session.status !== "loading" && hydrated

  useEffect(() => {
    const stored = readGuest()
    setGuest(stored)
    if (!userId) {
      setCart(stored.cart)
      setFavorites(stored.favorites)
    }
    setHydrated(true)
  }, [userId])

  useEffect(() => {
    if (session.status !== "authenticated" || !userId) {
      mergedForUser.current = null
      return
    }
    let cancelled = false
    ;(async () => {
      const guestState = readGuest()
      if (mergedForUser.current !== userId) {
        const merged = await mergeGuestShopState({
          cart: guestState.cart,
          favorites: guestState.favorites,
        })
        if (cancelled) return
        mergedForUser.current = userId
        writeGuest({ cart: [], favorites: [], compare: guestState.compare })
        setGuest({ cart: [], favorites: [], compare: guestState.compare })
        setCart(merged.cart)
        setFavorites(merged.favorites)
        setOrders(merged.orders)
        return
      }
      const state = await getAuthenticatedShopState()
      if (cancelled) return
      setCart(state.cart)
      setFavorites(state.favorites)
      setOrders(state.orders)
    })()
    return () => {
      cancelled = true
    }
  }, [session.status, userId])

  const persistGuest = useCallback((next: GuestStored) => {
    setGuest(next)
    writeGuest(next)
    setCart(next.cart)
    setFavorites(next.favorites)
  }, [])

  const syncCart = useCallback(
    async (next: CartLine[]) => {
      setCart(next)
      if (userId) {
        const saved = await setCartOnServer(next)
        setCart(saved)
        return
      }
      const current = readGuest()
      persistGuest({ ...current, cart: next })
    },
    [persistGuest, userId],
  )

  const syncFavorites = useCallback(
    async (next: string[]) => {
      setFavorites(next)
      if (userId) {
        const saved = await setFavoritesOnServer(next)
        setFavorites(saved)
        return
      }
      const current = readGuest()
      persistGuest({ ...current, favorites: next })
    },
    [persistGuest, userId],
  )

  const value = useMemo<ShopValue>(() => {
    const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0)
    const user =
      session.status === "authenticated" && session.data?.user
        ? {
            id: session.data.user.id,
            name: session.data.user.name ?? session.data.user.email ?? "Покупатель",
            email: session.data.user.email ?? "",
          }
        : null

    return {
      ready,
      cart,
      favorites,
      compare: guest.compare,
      user,
      orders,
      cartCount,
      addToCart: (productId, quantity = 1) => {
        const product = productOf(productId)
        if (!product || product.stockQuantity < 1) return
        const existing = cart.find((line) => line.productId === productId)
        const nextQuantity = clampQuantity(product, (existing?.quantity ?? 0) + quantity)
        const next = existing
          ? cart.map((line) =>
              line.productId === productId ? { ...line, quantity: nextQuantity } : line,
            )
          : [...cart, { productId, quantity: nextQuantity }]
        void syncCart(next)
      },
      setQuantity: (productId, quantity) => {
        const product = productOf(productId)
        if (!product) return
        const next = cart.map((line) =>
          line.productId === productId
            ? { ...line, quantity: clampQuantity(product, quantity) }
            : line,
        )
        void syncCart(next)
      },
      removeFromCart: (productId) => {
        void syncCart(cart.filter((line) => line.productId !== productId))
      },
      toggleFavorite: (productId) => {
        const next = favorites.includes(productId)
          ? favorites.filter((id) => id !== productId)
          : [...favorites, productId]
        void syncFavorites(next)
      },
      toggleCompare: (productId) => {
        const product = productOf(productId)
        if (!product) return "Товар недоступен"
        const compare = guest.compare
        if (compare.includes(productId)) {
          const next = { ...readGuest(), compare: compare.filter((id) => id !== productId) }
          setGuest(next)
          writeGuest(next)
          return null
        }
        if (compare.length >= compareLimit) {
          return `Можно сравнить не больше ${compareLimit} товаров`
        }
        const first = compare[0] ? productOf(compare[0]) : undefined
        if (first && first.categoryId !== product.categoryId) {
          return "Сравнивайте товары одной категории"
        }
        const next = { ...readGuest(), compare: [...compare, productId] }
        setGuest(next)
        writeGuest(next)
        return null
      },
      removeCompare: (productId) => {
        const next = { ...readGuest(), compare: guest.compare.filter((id) => id !== productId) }
        setGuest(next)
        writeGuest(next)
      },
      clearCompare: () => {
        const next = { ...readGuest(), compare: [] }
        setGuest(next)
        writeGuest(next)
      },
      placeOrder: async (input) => {
        if (!userId) return { ok: false, error: "Войдите, чтобы оформить заказ" }
        const result = await placeOrderAction({
          ...input,
          cart,
        })
        if (!result.ok) return result
        setCart([])
        setOrders((prev) => [result.order, ...prev.filter((item) => item.number !== result.order.number)])
        return result
      },
    }
  }, [
    cart,
    favorites,
    guest.compare,
    orders,
    ready,
    session.data?.user,
    session.status,
    syncCart,
    syncFavorites,
    userId,
  ])

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop() {
  const value = useContext(ShopContext)
  if (!value) throw new Error("ShopProvider отсутствует")
  return value
}
