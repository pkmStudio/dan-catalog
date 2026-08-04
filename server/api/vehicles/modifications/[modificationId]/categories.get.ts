import { eventHandler, getRouterParam } from 'h3'
import {
  applicableCategoryIdsByModification,
  catalogCategories,
  vehicleModifications
} from '../../../../fixtures'
import { mockDelay } from '../../../../utils/mock-delay'
import { mockResponse, throwMockError } from '../../../../utils/mock-response'

export const buildModificationCategoriesResponse = (modificationId: string | undefined) => {
  if (
    !modificationId ||
    !vehicleModifications.some((modification) => modification.id === modificationId)
  ) {
    return throwMockError(404, {
      code: 'VEHICLE_MODIFICATION_NOT_FOUND',
      message: 'Модификация автомобиля не найдена.'
    })
  }

  const categoryIds = new Set(applicableCategoryIdsByModification[modificationId] ?? [])
  return mockResponse(
    catalogCategories
      .filter((category) => categoryIds.has(category.id))
      .map(({ filterFacets: _filterFacets, ...category }) => category)
  )
}

export default eventHandler(async (event) => {
  await mockDelay()
  return buildModificationCategoriesResponse(getRouterParam(event, 'modificationId'))
})
