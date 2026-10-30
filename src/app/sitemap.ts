import type { MetadataRoute } from "next"
import { listCategorySlugs, listProductSlugs } from "@/db/catalog"
import { getSiteUrl } from "@/lib/site-url"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl()
  const staticRoutes = [
    "",
    "/catalog",
    "/delivery",
    "/payment",
    "/contacts",
    "/about",
    "/compare",
    "/favorites",
    "/cart",
  ]

  let categorySlugs: string[] = []
  let productSlugs: string[] = []
  try {
    ;[categorySlugs, productSlugs] = await Promise.all([listCategorySlugs(), listProductSlugs()])
  } catch {
    // база недоступна при сборке — отдаём только статику
  }

  const now = new Date()
  return [
    ...staticRoutes.map((path) => ({
      url: `${base}${path || "/"}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...categorySlugs.map((slug) => ({
      url: `${base}/catalog/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...productSlugs.map((slug) => ({
      url: `${base}/product/${slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
  ]
}
