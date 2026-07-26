import { delay } from '../utils/mock-data'

export default defineEventHandler(async (event) => {
  await delay()
  const body = await readBody(event)
  if (!body?.name || !body?.phone || !body?.message)
    throw createError({
      statusCode: 422,
      statusMessage: 'Заполните обязательные поля'
    })
  if (String(body.name).length > 32)
    throw createError({
      statusCode: 422,
      statusMessage: 'Имя не должно превышать 32 символа'
    })
  if (!/^[\p{L}\s-]+$/u.test(String(body.name)))
    throw createError({
      statusCode: 422,
      statusMessage: 'Имя должно содержать только буквы'
    })
  const phoneDigits = String(body.phone).replace(/\D/g, '')
  if (!/^7\d{10}$/.test(phoneDigits))
    throw createError({
      statusCode: 422,
      statusMessage: 'Укажите корректный номер телефона'
    })
  return { data: { id: `DAN-${String(Date.now()).slice(-5)}`, status: 'accepted' } }
})
