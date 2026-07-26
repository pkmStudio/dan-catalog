import { eventHandler, getQuery, getRouterParam } from 'h3'
import { catalogCategories as categories, catalogProducts as products } from '../../../../fixtures'
import {
  filterCatalogProducts,
  parseFilterTokens
} from '#server/domain/catalog/filter-products.ts'
import { mockDelay } from '#server/utils/mock-delay.ts'
import { mockResponse, throwMockError } from '#server/utils/mock-response.ts'

const toSummary = (product: (typeof products)[number]) => ({
  id: product.id,
  sku: product.sku,
  name: product.name,
  image: product.image
})

export const buildCategoryProductsResponse = (
  slug: string | undefined,
  query: Record<string, unknown> = {}
) => {
  const category = categories.find((item) => item.slug === slug)
  if (!category) {
    return throwMockError(404, {
      code: 'CATEGORY_NOT_FOUND',
      message: 'Категория не найдена.'
    })
  }

  const result = filterCatalogProducts(
    products.filter((product) => product.categoryId === category.id),
    category.filterFacets,
    {
      filters: parseFilterTokens(query.filter),
      page: Number(query.page)
    }
  )

  return mockResponse({
    categoryName: category.name,
    categoryDescription: category.description,
    items: result.items.map(toSummary),
    total: result.total,
    page: result.page,
    pageSize: result.pageSize,
    pageCount: result.pageCount,
    facets: category.filterFacets
  })
}

export default eventHandler(async (event) => {
  await mockDelay()
  return buildCategoryProductsResponse(getRouterParam(event, 'slug'), getQuery(event))
})
