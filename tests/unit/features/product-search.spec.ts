import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { SearchResponse } from '~/entities/product/model'
import {
  SEARCH_DEBOUNCE_MS,
  useProductSearchStore,
  type SearchExecutor
} from '~/features/product-search/model'
import { buildSearchResponse } from '~~/server/api/catalog/search.get'

const response = (sku: string, match: 'exact' | 'multiple' = 'multiple'): SearchResponse => ({
  data: {
    match,
    items: [
      {
        id: sku.toLowerCase(),
        sku,
        name: `Товар ${sku}`,
        image: `/images/${sku}.png`
      }
    ]
  }
})

const deferred = <T>() => {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })
  return { promise, reject, resolve }
}

describe('product search store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useRealTimers()
  })

  it('waits for the debounce threshold and ignores inputs shorter than two characters', async () => {
    vi.useFakeTimers()
    const store = useProductSearchStore()
    const executor = vi.fn<SearchExecutor>().mockResolvedValue(response('DAN-001'))

    store.updateQuery('д', 'unit', executor)
    await vi.advanceTimersByTimeAsync(SEARCH_DEBOUNCE_MS)
    expect(executor).not.toHaveBeenCalled()

    store.updateQuery('дан', 'unit', executor)
    await vi.advanceTimersByTimeAsync(SEARCH_DEBOUNCE_MS - 1)
    expect(executor).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1)
    expect(executor).toHaveBeenCalledOnce()
    expect(executor).toHaveBeenCalledWith('дан')
  })

  it('keeps the latest request result when an older request resolves last', async () => {
    const store = useProductSearchStore()
    const first = deferred<SearchResponse>()
    const second = deferred<SearchResponse>()

    const firstRequest = store.execute('первый', () => first.promise)
    const secondRequest = store.execute('второй', () => second.promise)

    second.resolve(response('NEW'))
    await secondRequest
    first.resolve(response('OLD'))
    await firstRequest

    expect(store.results[0]?.sku).toBe('NEW')
    expect(store.status).toBe('success')
  })

  it('validates an empty submission without calling the endpoint', async () => {
    const store = useProductSearchStore()
    const executor = vi.fn<SearchExecutor>()
    store.query = '   '

    await store.submitSearch('unit', executor)

    expect(executor).not.toHaveBeenCalled()
    expect(store.validationMessage).toBe('Введите артикул или название товара.')
    expect(store.status).toBe('idle')
  })

  it('does not classify an OEM-only query as a product match', () => {
    expect(buildSearchResponse('85212-0R040')).toEqual({
      data: { match: 'empty', items: [] }
    })
  })

  it('moves through loading, empty, error and retry states while preserving the query', async () => {
    const store = useProductSearchStore()
    store.query = 'редкий товар'

    await store.submitSearch('unit', async () => ({
      data: { match: 'empty', items: [] }
    }))
    expect(store.status).toBe('empty')
    expect(store.lastSearchQuery).toBe('редкий товар')

    await store.retrySearch('unit', async () => {
      throw new Error('Сеть недоступна')
    })
    expect(store.status).toBe('error')
    expect(store.query).toBe('редкий товар')

    await store.retrySearch('unit', async () => response('FOUND', 'exact'))
    expect(store.status).toBe('success')
    expect(store.match).toBe('exact')
  })
})
