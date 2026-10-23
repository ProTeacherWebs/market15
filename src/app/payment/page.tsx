import type { Metadata } from "next"
import { InfoPage } from "@/components/info-page"
import { storeDraft } from "@/data/store"

export const metadata: Metadata = { title: "Оплата" }

export default function PaymentPage() {
  return (
    <InfoPage title="Оплата">
      <p>{storeDraft.payment}</p>
      <p>Данные банковских карт магазин не принимает и не хранит.</p>
    </InfoPage>
  )
}
