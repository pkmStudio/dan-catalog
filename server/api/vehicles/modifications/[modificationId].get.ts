import { eventHandler } from 'h3'
import {
  useVehicleCatalogClient,
  type VehicleCatalogClient
} from '../../../integrations/vehicles-ddd/client'
import {
  parsePositiveRouteId,
  runVehicleCatalogHandler
} from '../../../integrations/vehicles-ddd/handler'
import { mapVehicleModificationContextResponse } from '../../../integrations/vehicles-ddd/mappers'

export const fetchVehicleModificationContext = async (
  client: VehicleCatalogClient,
  modificationId: number
) =>
  mapVehicleModificationContextResponse(
    await client.get(`/api/v1/catalog/modifications/${modificationId}`)
  )

export default eventHandler((event) =>
  runVehicleCatalogHandler(event, () =>
    fetchVehicleModificationContext(
      useVehicleCatalogClient(),
      parsePositiveRouteId(event, 'modificationId')
    )
  )
)
