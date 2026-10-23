import type { Metadata } from "next"
import { InfoPage } from "@/components/info-page"
import { storeDraft } from "@/data/store"

export const metadata: Metadata = { title: "Доставка" }

export default function DeliveryPage() {
  return (
    <InfoPage title="Доставка">
      <p>Черновик. Цифры и сроки ниже не являются тарифом.</p>
      <p>{storeDraft.delivery}</p>
      <p>Город: {storeDraft.city}.</p>
    </InfoPage>
  )
}
