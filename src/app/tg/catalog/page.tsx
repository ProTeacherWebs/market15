import { Suspense } from "react"
import { CatalogScreen } from "@/components/catalog-screen"
import { PageSkeleton } from "@/components/page-skeleton"

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default function TgCatalogPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CatalogScreen searchParams={searchParams} pathPrefix="/tg" />
    </Suspense>
  )
}
