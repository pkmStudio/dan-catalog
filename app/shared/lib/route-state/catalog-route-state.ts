export interface CatalogRouteState {
  categorySlug: string
  query?: string
  filters: Record<string, string[]>
  page: number
  vehicleModificationId?: string
}

export type CatalogRouteQuery = Record<string, unknown>

const FILTER_SEPARATOR = ':'

const normalizeOptionalString = (value: unknown): string | undefined => {
  const candidate = Array.isArray(value) ? value[0] : value
  if (typeof candidate !== 'string') return undefined

  const normalized = candidate.trim().replace(/\s+/gu, ' ')
  return normalized || undefined
}

const normalizePage = (value: unknown): number => {
  const candidate = normalizeOptionalString(value)
  if (!candidate || !/^[1-9]\d*$/u.test(candidate)) return 1

  const page = Number(candidate)
  return Number.isSafeInteger(page) ? page : 1
}

const normalizeFilterToken = (token: unknown): { key: string; value: string } | undefined => {
  if (typeof token !== 'string') return undefined

  const separatorIndex = token.indexOf(FILTER_SEPARATOR)
  if (separatorIndex <= 0 || separatorIndex === token.length - 1) return undefined

  const key = token.slice(0, separatorIndex).trim()
  const value = token.slice(separatorIndex + 1).trim()
  if (!/^[a-zA-Z0-9_-]+$/u.test(key) || !value) return undefined

  return { key, value }
}

const normalizeFilters = (value: unknown): Record<string, string[]> => {
  const tokens = Array.isArray(value) ? value : value === undefined ? [] : [value]
  const filters = new Map<string, Set<string>>()

  for (const token of tokens) {
    const normalized = normalizeFilterToken(token)
    if (!normalized) continue

    const values = filters.get(normalized.key) ?? new Set<string>()
    values.add(normalized.value)
    filters.set(normalized.key, values)
  }

  return Object.fromEntries(
    [...filters.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, values]) => [key, [...values].sort((left, right) => left.localeCompare(right))])
  )
}

export const normalizeCatalogFilters = (
  filters: Record<string, readonly string[]>
): Record<string, string[]> =>
  normalizeFilters(
    Object.entries(filters).flatMap(([key, values]) =>
      values.map((value) => `${key}${FILTER_SEPARATOR}${value}`)
    )
  )

export const parseCatalogRouteState = (
  categorySlug: string,
  routeQuery: CatalogRouteQuery
): CatalogRouteState => {
  const query = normalizeOptionalString(routeQuery.q)
  const vehicleModificationId = normalizeOptionalString(routeQuery.vehicleModificationId)

  return {
    categorySlug: categorySlug.trim(),
    ...(query ? { query } : {}),
    filters: normalizeFilters(routeQuery.filter),
    page: normalizePage(routeQuery.page),
    ...(vehicleModificationId ? { vehicleModificationId } : {})
  }
}

export const serializeCatalogRouteState = (
  state: CatalogRouteState
): Record<string, string | string[]> => {
  const query: Record<string, string | string[]> = {}
  const normalizedQuery = normalizeOptionalString(state.query)
  const normalizedFilters = normalizeCatalogFilters(state.filters)
  const normalizedVehicleId = normalizeOptionalString(state.vehicleModificationId)

  if (normalizedQuery) query.q = normalizedQuery

  const filterTokens = Object.entries(normalizedFilters).flatMap(([key, values]) =>
    values.map((value) => `${key}${FILTER_SEPARATOR}${value}`)
  )
  if (filterTokens.length) query.filter = filterTokens
  if (state.page > 1 && Number.isSafeInteger(state.page)) query.page = String(state.page)
  if (normalizedVehicleId) query.vehicleModificationId = normalizedVehicleId

  return query
}

export const replaceCatalogFilters = (
  state: CatalogRouteState,
  filters: Record<string, readonly string[]>
): CatalogRouteState => ({
  ...state,
  filters: normalizeCatalogFilters(filters),
  page: 1
})
