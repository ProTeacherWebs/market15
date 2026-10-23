import "dotenv/config"
import { db } from "../src/db"
import {
  categories as categoriesTable,
  productAttributes as attributesTable,
  productImages as imagesTable,
  products as productsTable,
} from "../src/db/schema"
import { categories, products } from "../src/data/catalog"

async function seed() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set")
  }

  await db.delete(attributesTable)
  await db.delete(imagesTable)
  await db.delete(productsTable)
  await db.delete(categoriesTable)

  await db.insert(categoriesTable).values(
    categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      imageUrl: category.imageUrl,
      sortOrder: category.sortOrder,
      isActive: category.isActive,
    })),
  )

  await db.insert(productsTable).values(
    products.map((product) => ({
      id: product.id,
      categoryId: product.categoryId,
      brand: product.brand,
      name: product.name,
      slug: product.slug,
      shortDescription: product.shortDescription,
      description: product.description,
      priceUzs: product.priceUzs,
      oldPriceUzs: product.oldPriceUzs,
      sku: product.sku,
      stockQuantity: product.stockQuantity,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
    })),
  )

  const images = products.flatMap((product) =>
    product.images.map((image) => ({
      id: image.id,
      productId: product.id,
      url: image.url,
      alt: image.alt,
      sortOrder: image.sortOrder,
    })),
  )
  if (images.length) {
    await db.insert(imagesTable).values(images)
  }

  const attributes = products.flatMap((product) =>
    product.attributes.map((attribute) => ({
      id: attribute.id,
      productId: product.id,
      name: attribute.name,
      value: attribute.value,
      unit: attribute.unit,
      sortOrder: attribute.sortOrder,
    })),
  )
  if (attributes.length) {
    await db.insert(attributesTable).values(attributes)
  }

  console.log(`Seeded ${categories.length} categories and ${products.length} products`)
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
