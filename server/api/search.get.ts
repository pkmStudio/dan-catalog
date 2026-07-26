import { products } from '../fixtures/catalog'
import { mockDelay } from '../utils/mock-delay'

export default defineEventHandler(async (event) => {
  await mockDelay()
  const q = String(getQuery(event).q || '')
    .trim()
    .toLowerCase()
  const items = q
    ? products
        .filter((x) => `${x.sku} ${x.name} ${x.oem.join(' ')}`.toLowerCase().includes(q))
        .slice(0, 8)
    : []
  return {
    data: { match: items.length === 1 ? 'exact' : items.length ? 'multiple' : 'empty', items }
  }
})
