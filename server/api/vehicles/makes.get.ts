import { delay, makes } from '../../utils/mock-data'

export default defineEventHandler(async () => {
  await delay()
  return { data: makes }
})
