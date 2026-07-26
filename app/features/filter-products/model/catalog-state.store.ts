import { defineStore } from 'pinia'
import {
  normalizeCatalogFilters,
  parseCatalogRouteState,
  serializeCatalogRouteState,
  type CatalogRouteQuery,
  type CatalogRouteState
} from '~/shared/lib/route-state'

export type CatalogState = CatalogRouteState

export const useCatalogStateStore = defineStore('catalog-state', {
  state: (): CatalogState => ({
    categorySlug: '',
    filters: {},
    page: 1
  }),

  getters: {
    serializedQuery: (state): Record<string, string | string[]> =>
      serializeCatalogRouteState(state),
    activeFilterCount: (state): number =>
      Object.values(state.filters).reduce((total, values) => total + values.length, 0)
  },

  actions: {
    restore(categorySlug: string, routeQuery: CatalogRouteQuery) {
      const state = parseCatalogRouteState(categorySlug, routeQuery)
      this.categorySlug = state.categorySlug
      this.filters = state.filters
      this.page = state.page
      this.query = state.query
      this.vehicleModificationId = state.vehicleModificationId
    },

    replaceFilters(filters: Record<string, readonly string[]>) {
      this.filters = normalizeCatalogFilters(filters)
      this.page = 1
    },

    toggleFilter(key: string, value: string) {
      const values = new Set(this.filters[key] ?? [])
      if (values.has(value)) values.delete(value)
      else values.add(value)
      this.replaceFilters({
        ...this.filters,
        [key]: [...values]
      })
    },

    removeFilter(key: string, value?: string) {
      if (value === undefined) {
        const next = Object.fromEntries(
          Object.entries(this.filters).filter(([filterKey]) => filterKey !== key)
        )
        this.replaceFilters(next)
        return
      }
      this.replaceFilters({
        ...this.filters,
        [key]: (this.filters[key] ?? []).filter((item) => item !== value)
      })
    },

    resetFilters() {
      this.replaceFilters({})
    },

    setPage(page: number) {
      this.page = Number.isSafeInteger(page) && page > 0 ? page : 1
    }
  }
})
