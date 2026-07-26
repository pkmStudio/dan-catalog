import { groups } from '../../fixtures/catalog'
import { mockDelay } from '../../utils/mock-delay'

export default defineEventHandler(async () => {
  await mockDelay()
  return { data: groups }
})
