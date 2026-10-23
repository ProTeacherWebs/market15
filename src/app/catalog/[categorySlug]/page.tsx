import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { CatalogScreen } from "@/components/catalog-screen"
import { PageSkeleton } from "@/components/page-skeleton"
import { findCategoryBySlug, listCategorySlugs } from "@/db/catalog"

export async function generateStaticParams() {
  try {
    const slugs = await listCategorySlugs()
    return slugs.map((categorySlug) => ({ categorySlug }))
  } catch {
    return []
  }
}

export const dynamicParams = true

type PageProps = {
  params: Promise<{ categorySlug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categorySlug } = await params
  const category = await findCategoryBySlug(categorySlug)
  return {
    title: category?.name ?? "Категория",
    description: category?.description ?? "Категория каталога VOLT STORE.",
  }
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { categorySlug } = await params
  if (!(await findCategoryBySlug(categorySlug))) notFound()
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CatalogScreen searchParams={searchParams} categorySlug={categorySlug} />
    </Suspense>
  )
}
