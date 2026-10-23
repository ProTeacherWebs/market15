import { asc, eq } from "drizzle-orm"
import { db } from "@/db"
import {
  categories as categoriesTable,
  productAttributes as attributesTable,
  productImages as imagesTable,
  products as productsTable,
} from "@/db/schema"
import type { Category, Product, ProductAttribute, ProductImage } from "@/data/catalog"

function mapCategory(row: typeof categoriesTable.$inferSelect): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    imageUrl: row.imageUrl,
    sortOrder: row.sortOrder,
    isActive: row.isActive,
  }
}

function mapProduct(
  row: typeof productsTable.$inferSelect,
  images: ProductImage[],
  attributes: ProductAttribute[],
): Product {
  return {
    id: row.id,
    categoryId: row.categoryId,
    brand: row.brand,
    name: row.name,
    slug: row.slug,
    shortDescription: row.shortDescription,
    description: row.description,
    priceUzs: row.priceUzs,
    oldPriceUzs: row.oldPriceUzs,
    sku: row.sku,
    stockQuantity: row.stockQuantity,
    isActive: row.isActive,
    isFeatured: row.isFeatured,
    images,
    attributes,
  }
}

export async function listActiveCategories(): Promise<Category[]> {
  const rows = await db
    .select()
    .from(categoriesTable)
    .where(eq(categoriesTable.isActive, true))
    .orderBy(asc(categoriesTable.sortOrder))
  return rows.map(mapCategory)
}

export async function findCategoryBySlug(slug: string): Promise<Category | undefined> {
  const rows = await db
    .select()
    .from(categoriesTable)
    .where(eq(categoriesTable.slug, slug))
    .limit(1)
  const row = rows[0]
  if (!row || !row.isActive) return undefined
  return mapCategory(row)
}

export async function listActiveProducts(): Promise<Product[]> {
  const [productRows, imageRows, attributeRows] = await Promise.all([
    db.select().from(productsTable).where(eq(productsTable.isActive, true)),
    db.select().from(imagesTable).orderBy(asc(imagesTable.sortOrder)),
    db.select().from(attributesTable).orderBy(asc(attributesTable.sortOrder)),
  ])

  const imagesByProduct = new Map<string, ProductImage[]>()
  for (const image of imageRows) {
    const list = imagesByProduct.get(image.productId) ?? []
    list.push({
      id: image.id,
      url: image.url,
      alt: image.alt,
      sortOrder: image.sortOrder,
    })
    imagesByProduct.set(image.productId, list)
  }

  const attributesByProduct = new Map<string, ProductAttribute[]>()
  for (const attribute of attributeRows) {
    const list = attributesByProduct.get(attribute.productId) ?? []
    list.push({
      id: attribute.id,
      name: attribute.name,
      value: attribute.value,
      unit: attribute.unit,
      sortOrder: attribute.sortOrder,
    })
    attributesByProduct.set(attribute.productId, list)
  }

  return productRows.map((row) =>
    mapProduct(row, imagesByProduct.get(row.id) ?? [], attributesByProduct.get(row.id) ?? []),
  )
}

export async function findProductBySlug(slug: string): Promise<Product | undefined> {
  const rows = await db.select().from(productsTable).where(eq(productsTable.slug, slug)).limit(1)
  const row = rows[0]
  if (!row || !row.isActive) return undefined

  const [imageRows, attributeRows] = await Promise.all([
    db
      .select()
      .from(imagesTable)
      .where(eq(imagesTable.productId, row.id))
      .orderBy(asc(imagesTable.sortOrder)),
    db
      .select()
      .from(attributesTable)
      .where(eq(attributesTable.productId, row.id))
      .orderBy(asc(attributesTable.sortOrder)),
  ])

  return mapProduct(
    row,
    imageRows.map((image) => ({
      id: image.id,
      url: image.url,
      alt: image.alt,
      sortOrder: image.sortOrder,
    })),
    attributeRows.map((attribute) => ({
      id: attribute.id,
      name: attribute.name,
      value: attribute.value,
      unit: attribute.unit,
      sortOrder: attribute.sortOrder,
    })),
  )
}

export async function listProductSlugs(): Promise<string[]> {
  const rows = await db
    .select({ slug: productsTable.slug })
    .from(productsTable)
    .where(eq(productsTable.isActive, true))
  return rows.map((row) => row.slug)
}

export async function listCategorySlugs(): Promise<string[]> {
  const rows = await db
    .select({ slug: categoriesTable.slug })
    .from(categoriesTable)
    .where(eq(categoriesTable.isActive, true))
  return rows.map((row) => row.slug)
}
