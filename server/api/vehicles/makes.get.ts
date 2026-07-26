import { makes } from '../../fixtures/vehicles'
import { mockDelay } from '../../utils/mock-delay'

export default defineEventHandler(async () => {
  await mockDelay()
  return { data: makes }
})
