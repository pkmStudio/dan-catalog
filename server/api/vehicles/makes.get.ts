import { vehicleMakes as makes } from '../../fixtures'
import { mockDelay } from '../../utils/mock-delay'

export default defineEventHandler(async () => {
  await mockDelay()
  return { data: makes }
})
