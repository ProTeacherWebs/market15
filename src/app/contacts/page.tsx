import type { Metadata } from "next"
import { InfoPage } from "@/components/info-page"
import { storeDraft } from "@/data/store"

export const metadata: Metadata = { title: "Контакты" }

export default function ContactsPage() {
  return (
    <InfoPage title="Контакты">
      <p>Черновик, адрес и телефон не подтверждены.</p>
      <p>{storeDraft.address}</p>
      <p>{storeDraft.phone}</p>
      <p>{storeDraft.email}</p>
      <p>{storeDraft.hours}</p>
    </InfoPage>
  )
}
