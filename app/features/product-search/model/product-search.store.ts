import { defineStore } from 'pinia'
import {
  searchResponseSchema,
  type ProductSummary,
  type SearchMatch,
  type SearchResponse
} from '~/entities/product/model'
import { apiRequest, searchProducts } from '~/shared/api'
import { getSafeErrorMessage } from '~/shared/api/error'

export const SEARCH_DEBOUNCE_MS = 280
export const SEARCH_MIN_QUERY_LENGTH = 2
export const SEARCH_RESULT_LIMIT = 8

export type SearchStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error'
export type SearchExecutor = (query: string) => Promise<SearchResponse>

interface ProductSearchState {
  query: string
  status: SearchStatus
  match: SearchMatch | null
  results: ProductSummary[]
  errorMessage: string
  validationMessage: string
  lastSearchQuery: string
  activeSurface: string
  highlightedIndex: number
  requestSequence: number
}

const debounceTimers = new WeakMap<object, ReturnType<typeof setTimeout>>()

const defaultSearchExecutor: SearchExecutor = (query) =>
  apiRequest(searchProducts(query, SEARCH_RESULT_LIMIT), (value) =>
    searchResponseSchema.parse(value)
  )

const normalizeQuery = (value: string): string => value.trim().replace(/\s+/gu, ' ')

export const useProductSearchStore = defineStore('product-search', {
  state: (): ProductSearchState => ({
    query: '',
    status: 'idle',
    match: null,
    results: [],
    errorMessage: '',
    validationMessage: '',
    lastSearchQuery: '',
    activeSurface: '',
    highlightedIndex: -1,
    requestSequence: 0
  }),

  getters: {
    isLoading: (state): boolean => state.status === 'loading',
    hasResults: (state): boolean => state.results.length > 0,
    activeResultId: (state): string | undefined =>
      state.highlightedIndex >= 0
        ? `product-search-option-${state.results[state.highlightedIndex]?.id}`
        : undefined
  },

  actions: {
    activateSurface(surface: string) {
      this.activeSurface = surface
    },

    clearDebounce() {
      const timer = debounceTimers.get(this)
      if (timer) clearTimeout(timer)
      debounceTimers.delete(this)
    },

    resetOutcome() {
      this.status = 'idle'
      this.match = null
      this.results = []
      this.errorMessage = ''
      this.highlightedIndex = -1
    },

    updateQuery(value: string, surface: string, executor: SearchExecutor = defaultSearchExecutor) {
      this.query = value
      this.activeSurface = surface
      this.validationMessage = ''
      this.errorMessage = ''
      this.highlightedIndex = -1
      this.clearDebounce()

      if (normalizeQuery(value).length < SEARCH_MIN_QUERY_LENGTH) {
        this.requestSequence += 1
        this.resetOutcome()
        return
      }

      const timer = setTimeout(() => {
        void this.searchSuggestions(executor)
      }, SEARCH_DEBOUNCE_MS)
      debounceTimers.set(this, timer)
    },

    async execute(
      query: string,
      executor: SearchExecutor = defaultSearchExecutor
    ): Promise<SearchResponse | undefined> {
      const normalizedQuery = normalizeQuery(query)
      const requestId = ++this.requestSequence
      this.status = 'loading'
      this.errorMessage = ''
      this.highlightedIndex = -1

      try {
        const response = await executor(normalizedQuery)
        if (requestId !== this.requestSequence) return undefined

        this.match = response.data.match
        this.results = response.data.items
        this.status = response.data.match === 'empty' ? 'empty' : 'success'
        return response
      } catch (error: unknown) {
        if (requestId !== this.requestSequence) return undefined

        this.match = null
        this.results = []
        this.status = 'error'
        this.errorMessage = getSafeErrorMessage(error)
        return undefined
      }
    },

    async searchSuggestions(
      executor: SearchExecutor = defaultSearchExecutor
    ): Promise<SearchResponse | undefined> {
      const normalizedQuery = normalizeQuery(this.query)
      if (normalizedQuery.length < SEARCH_MIN_QUERY_LENGTH) {
        this.resetOutcome()
        return undefined
      }

      return this.execute(normalizedQuery, executor)
    },

    async submitSearch(
      surface: string,
      executor: SearchExecutor = defaultSearchExecutor
    ): Promise<SearchResponse | undefined> {
      this.clearDebounce()
      this.activeSurface = surface
      const normalizedQuery = normalizeQuery(this.query)

      if (!normalizedQuery) {
        this.requestSequence += 1
        this.resetOutcome()
        this.validationMessage = 'Введите артикул или название товара.'
        return undefined
      }

      this.query = normalizedQuery
      this.lastSearchQuery = normalizedQuery
      this.validationMessage = ''
      return this.execute(normalizedQuery, executor)
    },

    async retrySearch(
      surface: string,
      executor: SearchExecutor = defaultSearchExecutor
    ): Promise<SearchResponse | undefined> {
      const retryQuery = this.lastSearchQuery || normalizeQuery(this.query)
      this.query = retryQuery
      this.activeSurface = surface
      return this.execute(retryQuery, executor)
    },

    moveHighlight(direction: 1 | -1) {
      if (!this.results.length) {
        this.highlightedIndex = -1
        return
      }

      const next = this.highlightedIndex + direction
      if (next < 0) this.highlightedIndex = this.results.length - 1
      else if (next >= this.results.length) this.highlightedIndex = 0
      else this.highlightedIndex = next
    }
  }
})
