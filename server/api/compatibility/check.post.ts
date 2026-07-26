import { mockDelay } from '../../utils/mock-delay'

export default defineEventHandler(async (event) => {
  await mockDelay()
  const body = await readBody(event)
  if (!body?.productId || !body?.modification)
    throw createError({
      statusCode: 400,
      statusMessage: 'Не переданы товар или автомобиль'
    })
  return { data: { compatible: true, message: 'Подходит для вашего автомобиля' } }
})
