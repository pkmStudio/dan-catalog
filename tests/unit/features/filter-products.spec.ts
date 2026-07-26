import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useCatalogStateStore } from '~/features/filter-products/model'

describe('catalog state store', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('restores filters and page from a route query', () => {
    const store = useCatalogStateStore()
    store.restore('wipers', {
      filter: ['type:Каркасная', 'side:Передняя'],
      page: '3'
    })

    expect(store.filters).toEqual({ side: ['Передняя'], type: ['Каркасная'] })
    expect(store.page).toBe(3)
  })

  it('resets page when a filter changes and serializes deterministically', () => {
    const store = useCatalogStateStore()
    store.restore('wipers', { page: '4' })
    store.toggleFilter('type', 'Гибридная')
    store.toggleFilter('type', 'Бескаркасная')

    expect(store.page).toBe(1)
    expect(store.serializedQuery).toEqual({
      filter: ['type:Бескаркасная', 'type:Гибридная']
    })
  })

  it('removes one value, one facet or all filters', () => {
    const store = useCatalogStateStore()
    store.replaceFilters({ type: ['Каркасная', 'Гибридная'], side: ['Передняя'] })
    store.removeFilter('type', 'Каркасная')
    expect(store.filters.type).toEqual(['Гибридная'])
    store.removeFilter('side')
    expect(store.filters.side).toBeUndefined()
    store.resetFilters()
    expect(store.filters).toEqual({})
  })
})
