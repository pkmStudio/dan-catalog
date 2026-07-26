import { describe, expect, it } from 'vitest'
import { searchResponseSchema } from '~/entities/product/model'
import { buildSearchResponse } from '~~/server/api/catalog/search.get'

describe('searchProducts contract', () => {
  it('returns a schema-valid exact SKU result', () => {
    const response = searchResponseSchema.parse(buildSearchResponse('lw 600'))

    expect(response.data.match).toBe('exact')
    expect(response.data.items).toHaveLength(1)
    expect(response.data.items[0]?.sku).toBe('LW-600')
    expect(response.data.items[0]?.name).toContain('600 мм')
    expect(response.data.items[0]?.image).toBe('/images/generated-1784981127693.png')
  })

  it('returns at most the requested number of name matches', () => {
    const response = searchResponseSchema.parse(buildSearchResponse('щётка', 3))

    expect(response.data.match).toBe('multiple')
    expect(response.data.items).toHaveLength(3)
  })

  it('does not search by OEM number', () => {
    const response = searchResponseSchema.parse(buildSearchResponse('85212-0R040'))

    expect(response.data).toEqual({ match: 'empty', items: [] })
  })

  it('treats е and ё as the same Russian search character', () => {
    const response = searchResponseSchema.parse(buildSearchResponse('щетка 600 мм', 8))

    expect(response.data.match).toBe('multiple')
    expect(response.data.items.length).toBeGreaterThan(0)
    expect(response.data.items.every((item) => item.name.includes('600'))).toBe(true)
  })

  it('returns an empty contract payload for an unknown product', () => {
    const response = searchResponseSchema.parse(buildSearchResponse('несуществующий товар'))

    expect(response.data).toEqual({ match: 'empty', items: [] })
  })

  it('returns the documented deterministic error payload', () => {
    expect.assertions(3)

    try {
      buildSearchResponse('error')
    } catch (error: unknown) {
      expect(error).toMatchObject({ statusCode: 503 })
      expect(error).toHaveProperty('data.error.code', 'SEARCH_TEMPORARILY_UNAVAILABLE')
      expect(error).toHaveProperty(
        'data.error.message',
        'Поиск временно недоступен. Попробуйте ещё раз.'
      )
    }
  })
})
