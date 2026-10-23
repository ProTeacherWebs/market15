export type OrderLine = {
  productId: string
  name: string
  sku: string
  unitPrice: number
  quantity: number
  lineTotal: number
}

export type MockOrder = {
  number: string
  createdAt: string
  customerName: string
  email: string
  phone: string
  deliveryMethod: "pickup" | "courier"
  address: string
  items: OrderLine[]
  subtotal: number
  status: "pending"
  paymentStatus: "not_started"
  isDemo: boolean
}

export const demoOrders: MockOrder[] = [
  {
    number: "VS-10420",
    createdAt: "2026-10-12T09:30:00.000Z",
    customerName: "Малика Каримова",
    email: "malika@example.uz",
    phone: "+998 90 123 45 67",
    deliveryMethod: "pickup",
    address: "",
    items: [
      {
        productId: "prd-105431",
        name: "Холодильник Artel HD345RND Eco Белый",
        sku: "00026057",
        unitPrice: 4_197_000,
        quantity: 1,
        lineTotal: 4_197_000,
      },
    ],
    subtotal: 4_197_000,
    status: "pending",
    paymentStatus: "not_started",
    isDemo: true,
  },
]
