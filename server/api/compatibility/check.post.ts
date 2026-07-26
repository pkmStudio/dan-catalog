import { delay } from '../../utils/mock-data'

export default defineEventHandler(async (event) => {
  await delay()
  const body = await readBody(event)
  if (!body?.productId || !body?.modification)
    throw createError({
      statusCode: 400,
      statusMessage: 'Не переданы товар или автомобиль'
    })
  return { data: { compatible: true, message: 'Подходит для вашего автомобиля' } }
})
