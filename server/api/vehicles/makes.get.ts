import { eventHandler } from 'h3'
import { vehicleMakes as makes } from '../../fixtures'
import { mockDelay } from '../../utils/mock-delay'
import { mockResponse } from '../../utils/mock-response'

export const buildVehicleMakesResponse = () =>
  mockResponse([...makes].sort((left, right) => left.sortOrder - right.sortOrder))

export default eventHandler(async () => {
  await mockDelay()
  return buildVehicleMakesResponse()
})
