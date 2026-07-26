import { getQuery, eventHandler } from 'h3'
import { catalogProducts as products, type CatalogFixtureProduct } from '../../fixtures'
import { isDeterministicFailure, mockDelay } from '../../utils/mock-delay'
import { mockResponse, throwMockError } from '../../utils/mock-response'

const DEFAULT_LIMIT = 8
const MAX_LIMIT = 20

const normalizeSearchValue = (value: string): string =>
  value
    .trim()
    .toLocaleLowerCase('ru-RU')
    .replace(/ё/gu, 'е')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(/\s+/gu, ' ')

const compactSearchValue = (value: string): string =>
  normalizeSearchValue(value).replace(/\s+/gu, '')

const toProductSummary = (product: CatalogFixtureProduct) => ({
  id: product.id,
  sku: product.sku,
  name: product.name,
  image: product.image
})

const parseLimit = (value: unknown): number => {
  const parsed = Number(value)
  if (!Number.isInteger(parsed)) return DEFAULT_LIMIT
  return Math.min(MAX_LIMIT, Math.max(1, parsed))
}

export const buildSearchResponse = (rawQuery: unknown, rawLimit?: unknown) => {
  const query = typeof rawQuery === 'string' ? rawQuery.trim() : ''
  if (!query) {
    return throwMockError(400, {
      code: 'SEARCH_QUERY_REQUIRED',
      message: 'Введите артикул или название товара.'
    })
  }

  if (isDeterministicFailure(query)) {
    return throwMockError(503, {
      code: 'SEARCH_TEMPORARILY_UNAVAILABLE',
      message: 'Поиск временно недоступен. Попробуйте ещё раз.'
    })
  }

  const normalizedQuery = normalizeSearchValue(query)
  const compactQuery = compactSearchValue(query)
  const queryTerms = normalizedQuery.split(' ').filter(Boolean)
  const limit = parseLimit(rawLimit)
  const exact = products.find((product) => compactSearchValue(product.sku) === compactQuery)

  if (exact) {
    return mockResponse({
      match: 'exact' as const,
      items: [toProductSummary(exact)]
    })
  }

  const items = products
    .filter((product) => {
      const searchableText = normalizeSearchValue(`${product.sku} ${product.name}`)
      const compactSearchableText = compactSearchValue(`${product.sku} ${product.name}`)
      return (
        queryTerms.every((term) => searchableText.includes(term)) ||
        compactSearchableText.includes(compactQuery)
      )
    })
    .slice(0, limit)
    .map(toProductSummary)

  return mockResponse({
    match: items.length ? ('multiple' as const) : ('empty' as const),
    items
  })
}

export default eventHandler(async (event) => {
  await mockDelay()
  const query = getQuery(event)
  return buildSearchResponse(query.q, query.limit)
})
