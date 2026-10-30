import { notFound } from "next/navigation"
import { Suspense } from "react"
import { CatalogScreen } from "@/components/catalog-screen"
import { PageSkeleton } from "@/components/page-skeleton"
import { findCategoryBySlug } from "@/db/catalog"

type PageProps = {
  params: Promise<{ categorySlug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function TgCategoryPage({ params, searchParams }: PageProps) {
  const { categorySlug } = await params
  if (!(await findCategoryBySlug(categorySlug))) notFound()
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CatalogScreen searchParams={searchParams} categorySlug={categorySlug} pathPrefix="/tg" />
    </Suspense>
  )
}
