import { eventHandler, getRouterParam } from 'h3'
import { catalogCategories as categories, catalogGroups as groups } from '../../../../fixtures'
import { mockDelay } from '#server/utils/mock-delay.ts'
import { mockResponse, throwMockError } from '#server/utils/mock-response.ts'

export const buildGroupCategoriesResponse = (groupId: string | undefined) => {
  if (!groupId || !groups.some((group) => group.id === groupId)) {
    return throwMockError(404, {
      code: 'PRODUCT_GROUP_NOT_FOUND',
      message: 'Группа товаров не найдена.'
    })
  }

  return mockResponse(
    categories
      .filter((category) => category.groupId === groupId)
      .map(({ filterFacets: _filterFacets, ...category }) => category)
  )
}

export default eventHandler(async (event) => {
  await mockDelay()
  return buildGroupCategoriesResponse(getRouterParam(event, 'groupId'))
})
