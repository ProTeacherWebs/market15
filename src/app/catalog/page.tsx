import type { Metadata } from "next"
import { Suspense } from "react"
import { CatalogScreen } from "@/components/catalog-screen"
import { PageSkeleton } from "@/components/page-skeleton"

export const metadata: Metadata = {
  title: "Каталог",
  description: "Бытовая техника VOLT STORE: поиск, фильтры и сортировка.",
}

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default function CatalogPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CatalogScreen searchParams={searchParams} />
    </Suspense>
  )
}
