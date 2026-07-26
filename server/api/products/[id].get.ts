import { delay, products } from '../../utils/mock-data'

export default defineEventHandler(async (event) => {
  await delay()
  const id = getRouterParam(event, 'id')
  const product = products.find((x) => x.id === id || x.sku.toLowerCase() === id?.toLowerCase())
  if (!product) throw createError({ statusCode: 404, statusMessage: 'Товар не найден' })
  return { data: product }
})
