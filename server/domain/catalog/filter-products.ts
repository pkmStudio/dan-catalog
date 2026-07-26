import type { CatalogFixtureFacet, CatalogFixtureProduct } from '../../fixtures'

export const CATALOG_PAGE_SIZE = 9 as const

export interface CatalogFilterInput {
  filters?: Record<string, readonly string[]>
  page?: number
}

const productFacetValue = (product: CatalogFixtureProduct, key: string): string | undefined => {
  if (key === 'type') return product.type
  if (key === 'side') return product.side
  if (key === 'length') return String(product.length)
  if (key === 'mount') return product.mount
  return undefined
}

export const normalizeCategoryFilters = (
  facets: readonly CatalogFixtureFacet[],
  filters: Record<string, readonly string[]> = {}
): Record<string, string[]> => {
  const normalized: Record<string, string[]> = {}

  for (const facet of facets) {
    const allowed = new Set(facet.options.map((option) => option.value))
    const values = [...new Set(filters[facet.key] ?? [])]
      .filter((value) => allowed.has(value))
      .sort((left, right) => left.localeCompare(right, 'ru'))
    if (values.length) normalized[facet.key] = values
  }

  return normalized
}

export const filterCatalogProducts = (
  products: readonly CatalogFixtureProduct[],
  facets: readonly CatalogFixtureFacet[],
  input: CatalogFilterInput = {}
) => {
  const filters = normalizeCategoryFilters(facets, input.filters)
  const filtered = products.filter((product) =>
    Object.entries(filters).every(([key, selected]) => {
      const value = productFacetValue(product, key)
      return value !== undefined && selected.includes(value)
    })
  )
  const pageCount = Math.ceil(filtered.length / CATALOG_PAGE_SIZE)
  const requestedPage =
    Number.isSafeInteger(input.page) && Number(input.page) > 0 ? Number(input.page) : 1
  const page = pageCount ? Math.min(requestedPage, pageCount) : 1
  const start = (page - 1) * CATALOG_PAGE_SIZE

  return {
    items: filtered.slice(start, start + CATALOG_PAGE_SIZE),
    total: filtered.length,
    page,
    pageSize: CATALOG_PAGE_SIZE,
    pageCount,
    filters
  }
}

export const parseFilterTokens = (value: unknown): Record<string, string[]> => {
  const tokens = Array.isArray(value) ? value : value === undefined ? [] : [value]
  const filters: Record<string, string[]> = {}

  for (const token of tokens) {
    if (typeof token !== 'string') continue
    const separator = token.indexOf(':')
    if (separator < 1 || separator === token.length - 1) continue
    const key = token.slice(0, separator).trim()
    const item = token.slice(separator + 1).trim()
    if (!/^[a-zA-Z0-9_-]+$/u.test(key) || !item) continue
    filters[key] = [...(filters[key] ?? []), item]
  }

  return filters
}
