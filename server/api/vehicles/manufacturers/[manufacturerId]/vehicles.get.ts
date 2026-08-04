import { eventHandler } from 'h3'
import {
  useVehicleCatalogClient,
  type VehicleCatalogClient
} from '../../../../integrations/vehicles-ddd/client'
import {
  parsePositiveRouteId,
  runVehicleCatalogHandler
} from '../../../../integrations/vehicles-ddd/handler'
import { mapManufacturerVehiclesResponse } from '../../../../integrations/vehicles-ddd/mappers'

export const fetchManufacturerVehicles = async (
  client: VehicleCatalogClient,
  manufacturerId: number
) =>
  mapManufacturerVehiclesResponse(
    await client.get(`/api/v1/catalog/manufacturers/${manufacturerId}/vehicles`),
    manufacturerId
  )

export default eventHandler((event) =>
  runVehicleCatalogHandler(event, () =>
    fetchManufacturerVehicles(
      useVehicleCatalogClient(),
      parsePositiveRouteId(event, 'manufacturerId')
    )
  )
)
