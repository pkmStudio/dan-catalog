import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { categoryListResponseSchema } from '~/entities/category/model'
import { productPageResponseSchema, productResponseSchema } from '~/entities/product/model'
import { productGroupListResponseSchema } from '~/entities/product-group/model'
import { buildCategoryProductsResponse } from '~~/server/api/catalog/categories/[slug]/products.get'
import { buildProductGroupsResponse } from '~~/server/api/catalog/groups.get'
import { buildGroupCategoriesResponse } from '~~/server/api/catalog/groups/[groupId]/categories.get'
import { buildProductResponse } from '~~/server/api/catalog/products/[productId].get'
import { categories, products } from '~~/server/fixtures/catalog'

describe('catalog contracts', () => {
  it('returns schema-valid product groups and categories', () => {
    const groups = productGroupListResponseSchema.parse(buildProductGroupsResponse())
    const categories = categoryListResponseSchema.parse(buildGroupCategoriesResponse('wipers'))

    expect(groups.data.length).toBeGreaterThan(1)
    expect(categories.data.map((item) => item.slug)).toContain('wipers')
    expect(categories.data.some((item) => item.productCount === 0)).toBe(true)
  })

  it('references only existing public images', () => {
    const imagePaths = [
      ...categories.map((category) => category.image),
      ...products.flatMap((product) => [product.image, ...product.images])
    ]

    expect(
      imagePaths.every((image) => existsSync(resolve('public', image.replace(/^\//u, ''))))
    ).toBe(true)
  })

  it('returns a normalized filtered nine-item page', () => {
    const response = productPageResponseSchema.parse(
      buildCategoryProductsResponse('wipers', {
        filter: ['type:Бескаркасная', 'type:Гибридная', 'side:Передняя'],
        page: '999'
      })
    )

    expect(response.data.pageSize).toBe(9)
    expect(response.data.categoryName).toBe('Щётки стеклоочистителя')
    expect(response.data.page).toBe(response.data.pageCount)
    expect(response.data.items.length).toBeLessThanOrEqual(9)
    expect(response.data.facets).toHaveLength(4)
  })

  it('returns a complete product with linked analog and SEO', () => {
    const response = productResponseSchema.parse(buildProductResponse('lw-600'))

    expect(response.data.images.length).toBeGreaterThan(1)
    expect(response.data.specifications.length).toBeGreaterThan(3)
    expect(response.data.oemNumbers.length).toBeGreaterThan(0)
    expect(response.data.analogs.some((item) => item.productId)).toBe(true)
    expect(response.data.seo.canonicalPath).toBe('/product/lw-600')
  })

  it('returns documented not-found errors', () => {
    expect(() => buildProductResponse('missing')).toThrow()
    expect(() => buildCategoryProductsResponse('missing')).toThrow()
    expect(() => buildGroupCategoriesResponse('missing')).toThrow()
  })
})
