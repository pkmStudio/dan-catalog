import { delay, models } from '../../utils/mock-data'

export default defineEventHandler(async (event) => {
  await delay()
  const makeId = String(getQuery(event).makeId || '')
  return { data: models.filter((x) => x.makeId === makeId) }
})
