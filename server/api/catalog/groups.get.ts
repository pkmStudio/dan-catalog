import { eventHandler } from 'h3'
import { catalogGroups as groups } from '../../fixtures'
import { mockDelay } from '../../utils/mock-delay'
import { mockResponse } from '../../utils/mock-response'

export const buildProductGroupsResponse = () =>
  mockResponse([...groups].sort((left, right) => left.sortOrder - right.sortOrder))

export default eventHandler(async () => {
  await mockDelay()
  return buildProductGroupsResponse()
})
