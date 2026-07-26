import { delay } from '../utils/mock-data'

export default defineEventHandler(async (event) => {
  await delay()
  const body = await readBody(event)
  if (!body?.name || !body?.phone || !body?.message || !body?.consent)
    throw createError({
      statusCode: 422,
      statusMessage: 'Заполните обязательные поля'
    })
  return { data: { id: `REQ-${Date.now()}`, status: 'accepted' } }
})
