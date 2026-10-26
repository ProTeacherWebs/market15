import type { Metadata } from "next"
import { InfoPage } from "@/components/info-page"
import { storeDraft } from "@/data/store"

export const metadata: Metadata = { title: "Оплата" }

export default function PaymentPage() {
  return (
    <InfoPage title="Оплата">
      <p>{storeDraft.payment}</p>
      <p>
        Карточные данные вводит только Stripe Checkout. Магазин не принимает и не хранит номера
        карт.
      </p>
      <p>
        Тестовая карта: <span className="font-mono text-ink">4242 4242 4242 4242</span>, любой
        будущий срок, любой CVC.
      </p>
    </InfoPage>
  )
}
