import { eventHandler, getRouterParam } from 'h3'
import { vehicleModels, vehicleModifications } from '../../../../fixtures'
import { mockDelay } from '../../../../utils/mock-delay'
import { mockResponse, throwMockError } from '../../../../utils/mock-response'

export const buildVehicleModificationsResponse = (modelId: string | undefined) => {
  if (!modelId || !vehicleModels.some((model) => model.id === modelId)) {
    return throwMockError(404, {
      code: 'VEHICLE_MODEL_NOT_FOUND',
      message: 'Модель автомобиля не найдена.'
    })
  }

  return mockResponse(
    vehicleModifications
      .filter((modification) => modification.modelId === modelId)
      .sort((left, right) => right.yearFrom - left.yearFrom)
  )
}

export default eventHandler(async (event) => {
  await mockDelay()
  return buildVehicleModificationsResponse(getRouterParam(event, 'modelId'))
})
