import { products } from '../../fixtures/catalog'
import { mockDelay } from '../../utils/mock-delay'

interface LegacyCatalogFilters {
  types: string[]
  sides: string[]
  lengths: number[]
  mounts: string[]
}

export default defineEventHandler(async (event) => {
  await mockDelay()
  const q = getQuery(event)
  const page = Number(q.page || 1),
    pageSize = Number(q.pageSize || 12)
  let filters: LegacyCatalogFilters = { types: [], sides: [], lengths: [], mounts: [] }
  try {
    if (q.filters) filters = JSON.parse(String(q.filters))
  } catch {
    filters = { types: [], sides: [], lengths: [], mounts: [] }
  }
  let list = [...products]
  if (filters.types.length) list = list.filter((x) => filters.types.includes(x.type))
  if (filters.sides.length) list = list.filter((x) => filters.sides.includes(x.side))
  if (filters.lengths.length) list = list.filter((x) => filters.lengths.includes(x.length))
  if (filters.mounts.length) list = list.filter((x) => filters.mounts.includes(x.mount))
  return {
    data: {
      items: list.slice((page - 1) * pageSize, page * pageSize),
      total: list.length,
      page,
      pageSize,
      pages: Math.ceil(list.length / pageSize)
    }
  }
})
