import { describe, expect, it } from 'vitest'
import {
  normalizeCatalogFilters,
  parseCatalogRouteState,
  replaceCatalogFilters,
  serializeCatalogRouteState
} from '~/shared/lib/route-state'

describe('catalog route state', () => {
  it('normalizes query values, filters and page deterministically', () => {
    expect(
      parseCatalogRouteState(' wipers ', {
        q: '  щётка   DAN ',
        filter: ['side:front', 'length:600', 'side:rear', 'side:front'],
        page: '02',
        vehicleModificationId: '9001'
      })
    ).toEqual({
      categorySlug: 'wipers',
      query: 'щётка DAN',
      filters: {
        length: ['600'],
        side: ['front', 'rear']
      },
      page: 1,
      vehicleModificationId: 9001
    })
  })

  it.each([
    ['zero', '0'],
    ['negative', '-2'],
    ['decimal', '2.5'],
    ['mixed', '2x'],
    ['unsafe', '999999999999999999999']
  ])('falls back to page 1 for %s input', (_case, page) => {
    expect(parseCatalogRouteState('wipers', { page }).page).toBe(1)
  })

  it('drops malformed and empty route values', () => {
    expect(
      parseCatalogRouteState('wipers', {
        q: ' ',
        filter: [null, '', ':value', 'key:', 'plain', 42],
        vehicleModificationId: []
      })
    ).toEqual({
      categorySlug: 'wipers',
      filters: {},
      page: 1
    })
  })

  it('serializes filters with stable key and value ordering', () => {
    const serialized = serializeCatalogRouteState({
      categorySlug: 'wipers',
      query: 'DAN',
      filters: {
        side: ['rear', 'front', 'rear'],
        length: ['600', '400']
      },
      page: 3,
      vehicleModificationId: 9001
    })

    expect(serialized).toEqual({
      q: 'DAN',
      filter: ['length:400', 'length:600', 'side:front', 'side:rear'],
      page: '3',
      vehicleModificationId: '9001'
    })
  })

  it('normalizes filters without mutating caller data', () => {
    const filters = { type: ['hybrid', 'frame', 'hybrid'] }
    expect(normalizeCatalogFilters(filters)).toEqual({ type: ['frame', 'hybrid'] })
    expect(filters).toEqual({ type: ['hybrid', 'frame', 'hybrid'] })
  })

  it('resets page when filters change and preserves other route context', () => {
    const state = parseCatalogRouteState('wipers', {
      q: 'DAN',
      page: '4',
      filter: 'side:front',
      vehicleModificationId: '9001'
    })

    expect(replaceCatalogFilters(state, { length: ['600'] })).toEqual({
      categorySlug: 'wipers',
      query: 'DAN',
      filters: { length: ['600'] },
      page: 1,
      vehicleModificationId: 9001
    })
  })

  it.each([
    ['array', ['9001']],
    ['zero', '0'],
    ['negative', '-1'],
    ['decimal', '1.5'],
    ['unsafe', '9007199254740992']
  ])('rejects %s modification identity at the URL boundary', (_case, value) => {
    expect(parseCatalogRouteState('wipers', { vehicleModificationId: value })).not.toHaveProperty(
      'vehicleModificationId'
    )
  })
})
