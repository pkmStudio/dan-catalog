import { describe, expect, it } from 'vitest'
import {
  filterCatalogProducts,
  normalizeCategoryFilters,
  parseFilterTokens
} from '~~/server/domain/catalog/filter-products'
import { products, wiperFacets } from '~~/server/fixtures/catalog'

describe('catalog filtering', () => {
  it('combines values in one facet with OR and facets with AND', () => {
    const result = filterCatalogProducts(products, wiperFacets, {
      filters: {
        type: ['Бескаркасная', 'Гибридная'],
        side: ['Задняя']
      }
    })

    expect(result.total).toBeGreaterThan(0)
    expect(
      result.items.every(
        (item) => ['Бескаркасная', 'Гибридная'].includes(item.type) && item.side === 'Задняя'
      )
    ).toBe(true)
  })

  it('drops unknown keys and values', () => {
    expect(
      normalizeCategoryFilters(wiperFacets, {
        unknown: ['value'],
        type: ['Каркасная', 'Неизвестная']
      })
    ).toEqual({ type: ['Каркасная'] })
  })

  it('normalizes invalid and out-of-range pages', () => {
    expect(filterCatalogProducts(products, wiperFacets, { page: -2 }).page).toBe(1)
    const last = filterCatalogProducts(products, wiperFacets, { page: 999 })
    expect(last.page).toBe(last.pageCount)
    expect(last.items.length).toBeLessThanOrEqual(9)
  })

  it('parses repeated key:value query tokens safely', () => {
    expect(parseFilterTokens(['type:Каркасная', 'type:Гибридная', 'broken'])).toEqual({
      type: ['Каркасная', 'Гибридная']
    })
  })
})
