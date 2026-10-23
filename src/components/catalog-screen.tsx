import Link from "next/link"
import { notFound } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import {
  attributeChoices,
  brandsFor,
  countLabel,
  pageSize,
  queryCatalog,
  type SortKey,
} from "@/data/catalog"
import { findCategoryBySlug, listActiveCategories, listActiveProducts } from "@/db/catalog"

type Search = Record<string, string | string[] | undefined>

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function numberOrUndefined(value: string | undefined) {
  if (!value) return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

const sorts: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Рекомендуемые" },
  { value: "price-asc", label: "Сначала дешевле" },
  { value: "price-desc", label: "Сначала дороже" },
  { value: "new", label: "Новинки" },
]

export async function CatalogScreen({
  searchParams,
  categorySlug,
}: {
  searchParams: Promise<Search>
  categorySlug?: string
}) {
  const params = await searchParams
  const [categoryList, productList] = await Promise.all([
    listActiveCategories(),
    listActiveProducts(),
  ])
  const category = categorySlug
    ? categoryList.find((item) => item.slug === categorySlug) ??
      (await findCategoryBySlug(categorySlug))
    : undefined
  if (categorySlug && !category) notFound()

  const q = one(params.q) ?? ""
  const brand = one(params.brand) ?? ""
  const attr = one(params.attr) ?? ""
  const sort = (one(params.sort) as SortKey | undefined) ?? "featured"
  const min = numberOrUndefined(one(params.min))
  const max = numberOrUndefined(one(params.max))
  const inStock = one(params.inStock) === "1"
  const page = numberOrUndefined(one(params.page)) ?? 1
  const result = queryCatalog(
    {
      q,
      category: category?.slug,
      brand,
      attr,
      sort: sorts.some((item) => item.value === sort) ? sort : "featured",
      min,
      max,
      inStock,
      page,
    },
    productList,
    categoryList,
  )
  const base = category ? `/catalog/${category.slug}` : "/catalog"
  const brands = brandsFor(category?.slug, productList, categoryList)
  const attributes = attributeChoices(category?.slug, productList, categoryList)

  function href(next: Record<string, string | undefined>) {
    const search = new URLSearchParams()
    const values = {
      q,
      brand,
      attr,
      sort: sort === "featured" ? "" : sort,
      min: min?.toString() ?? "",
      max: max?.toString() ?? "",
      inStock: inStock ? "1" : "",
      ...next,
    }
    for (const [key, value] of Object.entries(values)) {
      if (!value || (key === "page" && value === "1")) continue
      search.set(key, value)
    }
    const query = search.toString()
    return query ? `${base}?${query}` : base
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-8">
      <h1 className="text-3xl font-semibold tracking-tight text-ink md:text-5xl">
        {category ? category.name : "Каталог"}
      </h1>
      <p className="mt-3 max-w-[52ch] text-muted">
        {category
          ? category.description
          : "Поиск по названию, бренду и артикулу. Фильтры сохраняются в адресе страницы."}
      </p>
      <form action={base} method="get" className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {q ? <input type="hidden" name="q" value={q} /> : null}
        <label className="grid gap-2 text-sm">
          Бренд
          <select
            name="brand"
            defaultValue={brand}
            className="h-11 rounded-[10px] border border-line bg-surface px-3 text-ink"
          >
            <option value="">Все бренды</option>
            {brands.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm">
          Цена от, сум
          <input
            name="min"
            inputMode="numeric"
            defaultValue={min ?? ""}
            className="h-11 rounded-[10px] border border-line bg-surface px-3 text-ink"
          />
        </label>
        <label className="grid gap-2 text-sm">
          Цена до, сум
          <input
            name="max"
            inputMode="numeric"
            defaultValue={max ?? ""}
            className="h-11 rounded-[10px] border border-line bg-surface px-3 text-ink"
          />
        </label>
        <label className="grid gap-2 text-sm">
          Сортировка
          <select
            name="sort"
            defaultValue={sort}
            className="h-11 rounded-[10px] border border-line bg-surface px-3 text-ink"
          >
            {sorts.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        {attributes.length > 0 ? (
          <label className="grid gap-2 text-sm md:col-span-2">
            Характеристика
            <select
              name="attr"
              defaultValue={attr}
              className="h-11 rounded-[10px] border border-line bg-surface px-3 text-ink"
            >
              <option value="">Любая</option>
              {attributes.map((item) => {
                const value = `${item.name}|${item.value}|${item.unit}`
                const label = item.unit ? `${item.name}: ${item.value} ${item.unit}` : `${item.name}: ${item.value}`
                return (
                  <option key={value} value={value}>
                    {label}
                  </option>
                )
              })}
            </select>
          </label>
        ) : null}
        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <input type="checkbox" name="inStock" value="1" defaultChecked={inStock} />
          Только в наличии
        </label>
        <div className="flex items-end">
          <button
            type="submit"
            className="inline-flex h-11 items-center rounded-full bg-accent px-5 text-sm font-medium text-accent-ink"
          >
            Показать
          </button>
        </div>
      </form>
      <p className="mt-6 text-sm text-muted">
        {countLabel(result.total)}
        {result.total > pageSize ? `, страница ${result.page} из ${result.pages}` : ""}
      </p>
      {result.total === 0 ? (
        <p className="mt-6 text-ink">
          Ничего не нашлось. Измените фильтры или{" "}
          <Link href="/catalog" className="text-accent transition-colors hover:text-[#d4ec6e]">
            откройте весь каталог
          </Link>
          .
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      {result.pages > 1 ? (
        <nav aria-label="Страницы каталога" className="mt-8 flex gap-3">
          {result.page > 1 ? (
            <Link
              href={href({ page: String(result.page - 1) })}
              className="inline-flex h-10 items-center rounded-full border border-line/80 px-4 text-sm text-ink transition-[border-color,background-color,transform] duration-[280ms] hover:-translate-y-0.5 hover:border-accent/40 hover:bg-surface-raised"
            >
              Назад
            </Link>
          ) : null}
          {result.page < result.pages ? (
            <Link
              href={href({ page: String(result.page + 1) })}
              className="inline-flex h-10 items-center rounded-full border border-line/80 px-4 text-sm text-ink transition-[border-color,background-color,transform] duration-[280ms] hover:-translate-y-0.5 hover:border-accent/40 hover:bg-surface-raised"
            >
              Дальше
            </Link>
          ) : null}
        </nav>
      ) : null}
    </div>
  )
}
