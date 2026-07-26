import { vehicleModels as models } from '../../fixtures'
import { mockDelay } from '../../utils/mock-delay'

export default defineEventHandler(async (event) => {
  await mockDelay()
  const makeId = String(getQuery(event).makeId || '')
  return { data: models.filter((x) => x.makeId === makeId) }
})
