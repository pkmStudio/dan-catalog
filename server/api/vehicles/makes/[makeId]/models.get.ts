import { eventHandler, getRouterParam } from 'h3'
import { vehicleMakes, vehicleModels } from '../../../../fixtures'
import { mockDelay } from '../../../../utils/mock-delay'
import { mockResponse, throwMockError } from '../../../../utils/mock-response'

export const buildVehicleModelsResponse = (makeId: string | undefined) => {
  if (!makeId || !vehicleMakes.some((make) => make.id === makeId)) {
    return throwMockError(404, {
      code: 'VEHICLE_MAKE_NOT_FOUND',
      message: 'Марка автомобиля не найдена.'
    })
  }

  return mockResponse(
    vehicleModels
      .filter((model) => model.makeId === makeId)
      .sort((left, right) => left.sortOrder - right.sortOrder)
  )
}

export default eventHandler(async (event) => {
  await mockDelay()
  return buildVehicleModelsResponse(getRouterParam(event, 'makeId'))
})
