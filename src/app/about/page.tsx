import type { Metadata } from "next"
import { InfoPage } from "@/components/info-page"
import { storeDraft } from "@/data/store"

export const metadata: Metadata = { title: "О магазине" }

export default function AboutPage() {
  return (
    <InfoPage title="О магазине">
      <p>
        VOLT STORE продаёт бытовую технику для дома в {storeDraft.city}. На этом шаге каталог
        собран из примерных товаров.
      </p>
      <p>{storeDraft.guestOrder}</p>
    </InfoPage>
  )
}