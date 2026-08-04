import { eventHandler, getQuery, getRouterParam } from 'h3'
import { catalogProducts, vehicleCompatibility, vehicleModifications } from '../../../../fixtures'
import { mockDelay } from '../../../../utils/mock-delay'
import { mockResponse, throwMockError } from '../../../../utils/mock-response'

const messages = {
  compatible: 'Товар подтверждён для выбранной модификации.',
  incompatible: 'Товар не предназначен для выбранной модификации.',
  unknown: 'Данных недостаточно — уточните применяемость перед установкой.'
} as const

export const buildProductCompatibilityResponse = (
  productId: string | undefined,
  modificationId: string | undefined
) => {
  const product = catalogProducts.find((item) => item.id === productId)
  const modification = vehicleModifications.find((item) => item.id === modificationId)

  if (!product) {
    return throwMockError(404, {
      code: 'PRODUCT_NOT_FOUND',
      message: 'Товар не найден.'
    })
  }
  if (!modification) {
    return throwMockError(404, {
      code: 'VEHICLE_MODIFICATION_NOT_FOUND',
      message: 'Модификация автомобиля не найдена.'
    })
  }

  const fixture = vehicleCompatibility.find(
    (item) => item.productId === product.id && item.modificationId === modification.id
  )
  const status = fixture?.status ?? 'unknown'

  return mockResponse({
    productId: product.id,
    modificationId: modification.id,
    status,
    message: messages[status],
    applications:
      status === 'compatible'
        ? [{ modificationId: modification.id, label: modification.displayName }]
        : []
  })
}

export default eventHandler(async (event) => {
  await mockDelay()
  const query = getQuery(event)
  return buildProductCompatibilityResponse(
    getRouterParam(event, 'productId'),
    typeof query.vehicleModificationId === 'string' ? query.vehicleModificationId : undefined
  )
})
