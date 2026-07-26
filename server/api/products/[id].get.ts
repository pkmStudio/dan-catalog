import { products } from '../../fixtures/catalog'
import { mockDelay } from '../../utils/mock-delay'

export default defineEventHandler(async (event) => {
  await mockDelay()
  const id = getRouterParam(event, 'id')
  const product = products.find((x) => x.id === id || x.sku.toLowerCase() === id?.toLowerCase())
  if (!product) throw createError({ statusCode: 404, statusMessage: 'Товар не найден' })
  return { data: product }
})
