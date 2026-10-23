"use server"

import bcrypt from "bcryptjs"
import { and, desc, eq, inArray, sql } from "drizzle-orm"
import { z } from "zod"
import { auth, signIn } from "@/auth"
import { db } from "@/db"
import { getTxDb } from "@/db/pool"
import {
  cartItems,
  carts,
  favorites,
  orderItems,
  orders,
  products,
  users,
} from "@/db/schema"

export type CartLineInput = { productId: string; quantity: number }

export type ShopOrder = {
  id: string
  number: string
  createdAt: string
  customerName: string
  email: string
  phone: string
  deliveryMethod: "pickup" | "courier"
  address: string
  items: {
    productId: string | null
    name: string
    sku: string
    unitPrice: number
    quantity: number
    lineTotal: number
  }[]
  subtotal: number
  status: string
  paymentStatus: string
}

async function requireUserId() {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) throw new Error("Нужен вход")
  return { session, userId }
}

async function ensureCart(userId: string) {
  const existing = await db.select().from(carts).where(eq(carts.userId, userId)).limit(1)
  if (existing[0]) return existing[0]
  const id = crypto.randomUUID()
  await db.insert(carts).values({ id, userId })
  return { id, userId, createdAt: new Date(), updatedAt: new Date() }
}

export async function loginUser(input: { email: string; password: string }) {
  const schema = z.object({
    email: z.string().trim().email(),
    password: z.string().min(1),
  })
  const parsed = schema.safeParse(input)
  if (!parsed.success) {
    return { ok: false as const, error: "Укажите почту и пароль" }
  }
  try {
    await signIn("credentials", {
      email: parsed.data.email.toLowerCase(),
      password: parsed.data.password,
      redirect: false,
    })
    return { ok: true as const }
  } catch {
    return { ok: false as const, error: "Неверная почта или пароль" }
  }
}

export async function registerUser(input: {
  name: string
  email: string
  password: string
}) {
  const schema = z.object({
    name: z.string().trim().min(2),
    email: z.string().trim().email(),
    password: z.string().min(6),
  })
  const parsed = schema.safeParse(input)
  if (!parsed.success) {
    return { ok: false as const, error: "Проверьте имя, почту и пароль (от 6 символов)" }
  }
  const email = parsed.data.email.toLowerCase()
  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1)
  if (existing[0]) {
    return { ok: false as const, error: "Такая почта уже зарегистрирована" }
  }
  const passwordHash = await bcrypt.hash(parsed.data.password, 12)
  await db.insert(users).values({
    id: crypto.randomUUID(),
    name: parsed.data.name,
    email,
    passwordHash,
  })
  await signIn("credentials", {
    email,
    password: parsed.data.password,
    redirect: false,
  })
  return { ok: true as const }
}

export async function getAuthenticatedShopState() {
  const session = await auth()
  if (!session?.user?.id) {
    return {
      user: null as null | { id: string; name: string; email: string },
      cart: [] as CartLineInput[],
      favorites: [] as string[],
      orders: [] as ShopOrder[],
    }
  }
  const userId = session.user.id
  const cart = await ensureCart(userId)
  const [itemRows, favoriteRows, orderRows] = await Promise.all([
    db.select().from(cartItems).where(eq(cartItems.cartId, cart.id)),
    db.select().from(favorites).where(eq(favorites.userId, userId)),
    db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt)),
  ])
  const orderIds = orderRows.map((order) => order.id)
  const lines =
    orderIds.length > 0
      ? await db.select().from(orderItems).where(inArray(orderItems.orderId, orderIds))
      : []
  const itemsByOrder = new Map<string, typeof lines>()
  for (const line of lines) {
    const list = itemsByOrder.get(line.orderId) ?? []
    list.push(line)
    itemsByOrder.set(line.orderId, list)
  }

  return {
    user: {
      id: userId,
      name: session.user.name ?? session.user.email ?? "Покупатель",
      email: session.user.email ?? "",
    },
    cart: itemRows.map((item) => ({ productId: item.productId, quantity: item.quantity })),
    favorites: favoriteRows.map((item) => item.productId),
    orders: orderRows.map((order) => ({
      id: order.id,
      number: order.orderNumber,
      createdAt: order.createdAt.toISOString(),
      customerName: order.customerName,
      email: order.customerEmail,
      phone: order.customerPhone,
      deliveryMethod: order.deliveryMethod,
      address: order.deliveryAddress,
      items: (itemsByOrder.get(order.id) ?? []).map((item) => ({
        productId: item.productId,
        name: item.productNameSnapshot,
        sku: item.productSkuSnapshot,
        unitPrice: item.unitPriceUzs,
        quantity: item.quantity,
        lineTotal: item.lineTotalUzs,
      })),
      subtotal: order.subtotalUzs,
      status: order.status,
      paymentStatus: order.paymentStatus,
    })),
  }
}

export async function mergeGuestShopState(input: {
  cart: CartLineInput[]
  favorites: string[]
}) {
  const { userId } = await requireUserId()
  const cart = await ensureCart(userId)
  const currentItems = await db.select().from(cartItems).where(eq(cartItems.cartId, cart.id))
  const quantityByProduct = new Map(currentItems.map((item) => [item.productId, item.quantity]))
  for (const line of input.cart) {
    if (!line.productId || line.quantity < 1) continue
    quantityByProduct.set(
      line.productId,
      Math.max(quantityByProduct.get(line.productId) ?? 0, Math.floor(line.quantity)),
    )
  }

  const productIds = [...quantityByProduct.keys()]
  const productRows =
    productIds.length > 0
      ? await db.select().from(products).where(inArray(products.id, productIds))
      : []
  const productMap = new Map(productRows.map((product) => [product.id, product]))

  await db.delete(cartItems).where(eq(cartItems.cartId, cart.id))
  const nextCart = [...quantityByProduct.entries()]
    .map(([productId, quantity]) => {
      const product = productMap.get(productId)
      if (!product || !product.isActive || product.stockQuantity < 1) return null
      return {
        id: crypto.randomUUID(),
        cartId: cart.id,
        productId,
        quantity: Math.min(product.stockQuantity, Math.max(1, quantity)),
      }
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
  if (nextCart.length) await db.insert(cartItems).values(nextCart)

  const favoriteIds = [...new Set(input.favorites.filter(Boolean))]
  if (favoriteIds.length) {
    const valid = await db
      .select({ id: products.id })
      .from(products)
      .where(and(inArray(products.id, favoriteIds), eq(products.isActive, true)))
    if (valid.length) {
      await db
        .insert(favorites)
        .values(valid.map((product) => ({ userId, productId: product.id })))
        .onConflictDoNothing()
    }
  }

  return getAuthenticatedShopState()
}

export async function setCartOnServer(cart: CartLineInput[]) {
  const { userId } = await requireUserId()
  const row = await ensureCart(userId)
  const productIds = cart.map((line) => line.productId)
  const productRows =
    productIds.length > 0
      ? await db.select().from(products).where(inArray(products.id, productIds))
      : []
  const productMap = new Map(productRows.map((product) => [product.id, product]))
  await db.delete(cartItems).where(eq(cartItems.cartId, row.id))
  const values = cart
    .map((line) => {
      const product = productMap.get(line.productId)
      if (!product || !product.isActive || product.stockQuantity < 1) return null
      return {
        id: crypto.randomUUID(),
        cartId: row.id,
        productId: line.productId,
        quantity: Math.min(product.stockQuantity, Math.max(1, Math.floor(line.quantity))),
      }
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
  if (values.length) await db.insert(cartItems).values(values)
  return values.map((item) => ({ productId: item.productId, quantity: item.quantity }))
}

export async function setFavoritesOnServer(productIds: string[]) {
  const { userId } = await requireUserId()
  await db.delete(favorites).where(eq(favorites.userId, userId))
  const unique = [...new Set(productIds)]
  if (!unique.length) return []
  const valid = await db
    .select({ id: products.id })
    .from(products)
    .where(and(inArray(products.id, unique), eq(products.isActive, true)))
  if (valid.length) {
    await db.insert(favorites).values(valid.map((product) => ({ userId, productId: product.id })))
  }
  return valid.map((product) => product.id)
}

const placeOrderSchema = z.object({
  customerName: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().min(9),
  deliveryMethod: z.enum(["pickup", "courier"]),
  address: z.string().trim(),
  idempotencyKey: z.string().uuid(),
  cart: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().positive(),
    }),
  ),
})

export async function placeOrderAction(raw: z.infer<typeof placeOrderSchema>) {
  const parsed = placeOrderSchema.safeParse(raw)
  if (!parsed.success) {
    return { ok: false as const, error: "Проверьте данные заказа" }
  }
  if (parsed.data.deliveryMethod === "courier" && parsed.data.address.length < 5) {
    return { ok: false as const, error: "Укажите адрес доставки" }
  }

  const { userId } = await requireUserId()
  const txDb = getTxDb()

  try {
    const result = await txDb.transaction(async (tx) => {
      const existing = await tx
        .select()
        .from(orders)
        .where(eq(orders.idempotencyKey, parsed.data.idempotencyKey))
        .limit(1)
      if (existing[0]) {
        const lines = await tx
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, existing[0].id))
        return {
          duplicate: true as const,
          order: existing[0],
          lines,
        }
      }

      const productIds = parsed.data.cart.map((line) => line.productId)
      const productRows =
        productIds.length > 0
          ? await tx.select().from(products).where(inArray(products.id, productIds))
          : []
      const productMap = new Map(productRows.map((product) => [product.id, product]))
      const prepared: {
        productId: string
        name: string
        sku: string
        unitPrice: number
        quantity: number
        lineTotal: number
      }[] = []

      for (const line of parsed.data.cart) {
        const product = productMap.get(line.productId)
        if (!product || !product.isActive) {
          throw new Error("Товар недоступен")
        }
        if (product.stockQuantity < line.quantity) {
          throw new Error(`Недостаточно остатка: ${product.name}`)
        }
        prepared.push({
          productId: product.id,
          name: product.name,
          sku: product.sku,
          unitPrice: product.priceUzs,
          quantity: line.quantity,
          lineTotal: product.priceUzs * line.quantity,
        })
      }

      if (prepared.length === 0) throw new Error("Корзина пуста")

      for (const line of prepared) {
        const updated = await tx
          .update(products)
          .set({
            stockQuantity: sql`${products.stockQuantity} - ${line.quantity}`,
            updatedAt: new Date(),
          })
          .where(
            and(eq(products.id, line.productId), sql`${products.stockQuantity} >= ${line.quantity}`),
          )
          .returning({ id: products.id })
        if (!updated[0]) throw new Error(`Недостаточно остатка: ${line.name}`)
      }

      const orderId = crypto.randomUUID()
      const orderNumber = `VS-${Date.now().toString().slice(-8)}`
      const subtotal = prepared.reduce((sum, line) => sum + line.lineTotal, 0)
      const [order] = await tx
        .insert(orders)
        .values({
          id: orderId,
          orderNumber,
          idempotencyKey: parsed.data.idempotencyKey,
          userId,
          customerName: parsed.data.customerName,
          customerEmail: parsed.data.email.toLowerCase(),
          customerPhone: parsed.data.phone,
          deliveryAddress: parsed.data.deliveryMethod === "courier" ? parsed.data.address : "",
          deliveryMethod: parsed.data.deliveryMethod,
          deliveryCostUzs: 0,
          subtotalUzs: subtotal,
          totalUzs: subtotal,
          currency: "UZS",
          status: "pending",
          paymentStatus: "not_started",
          isTestPayment: true,
        })
        .returning()

      const lines = prepared.map((line) => ({
        id: crypto.randomUUID(),
        orderId,
        productId: line.productId,
        productNameSnapshot: line.name,
        productSkuSnapshot: line.sku,
        unitPriceUzs: line.unitPrice,
        quantity: line.quantity,
        lineTotalUzs: line.lineTotal,
      }))
      await tx.insert(orderItems).values(lines)

      const cart = await tx.select().from(carts).where(eq(carts.userId, userId)).limit(1)
      if (cart[0]) {
        await tx.delete(cartItems).where(eq(cartItems.cartId, cart[0].id))
      }

      return { duplicate: false as const, order, lines }
    })

    return {
      ok: true as const,
      order: {
        id: result.order.id,
        number: result.order.orderNumber,
        createdAt: result.order.createdAt.toISOString(),
        customerName: result.order.customerName,
        email: result.order.customerEmail,
        phone: result.order.customerPhone,
        deliveryMethod: result.order.deliveryMethod,
        address: result.order.deliveryAddress,
        items: result.lines.map((item) => ({
          productId: item.productId,
          name: item.productNameSnapshot,
          sku: item.productSkuSnapshot,
          unitPrice: item.unitPriceUzs,
          quantity: item.quantity,
          lineTotal: item.lineTotalUzs,
        })),
        subtotal: result.order.subtotalUzs,
        status: result.order.status,
        paymentStatus: result.order.paymentStatus,
      },
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Не удалось создать заказ"
    return { ok: false as const, error: message }
  }
}

export async function getOrderForOwner(orderNumber: string) {
  const session = await auth()
  if (!session?.user?.id) return null
  const rows = await db
    .select()
    .from(orders)
    .where(and(eq(orders.orderNumber, orderNumber), eq(orders.userId, session.user.id)))
    .limit(1)
  const order = rows[0]
  if (!order) return null
  const lines = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id))
  return {
    id: order.id,
    number: order.orderNumber,
    createdAt: order.createdAt.toISOString(),
    customerName: order.customerName,
    email: order.customerEmail,
    phone: order.customerPhone,
    deliveryMethod: order.deliveryMethod,
    address: order.deliveryAddress,
    items: lines.map((item) => ({
      productId: item.productId,
      name: item.productNameSnapshot,
      sku: item.productSkuSnapshot,
      unitPrice: item.unitPriceUzs,
      quantity: item.quantity,
      lineTotal: item.lineTotalUzs,
    })),
    subtotal: order.subtotalUzs,
    status: order.status,
    paymentStatus: order.paymentStatus,
  } satisfies ShopOrder
}
