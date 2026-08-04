import { eventHandler } from 'h3'
import {
  useVehicleCatalogClient,
  type VehicleCatalogClient
} from '../../../integrations/vehicles-ddd/client'
import {
  parsePositiveRouteId,
  runVehicleCatalogHandler
} from '../../../integrations/vehicles-ddd/handler'
import { mapVehicleModificationsResponse } from '../../../integrations/vehicles-ddd/mappers'

export const fetchVehicleModifications = async (client: VehicleCatalogClient, vehicleId: number) =>
  mapVehicleModificationsResponse(
    await client.get(`/api/v1/catalog/vehicles/${vehicleId}/modifications`),
    vehicleId
  )

export default eventHandler((event) =>
  runVehicleCatalogHandler(event, () =>
    fetchVehicleModifications(useVehicleCatalogClient(), parsePositiveRouteId(event, 'vehicleId'))
  )
)
