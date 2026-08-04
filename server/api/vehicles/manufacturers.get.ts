import { eventHandler } from 'h3'
import {
  useVehicleCatalogClient,
  type VehicleCatalogClient
} from '../../integrations/vehicles-ddd/client'
import { runVehicleCatalogHandler } from '../../integrations/vehicles-ddd/handler'
import { mapVehicleManufacturersResponse } from '../../integrations/vehicles-ddd/mappers'

export const fetchVehicleManufacturers = async (client: VehicleCatalogClient) =>
  mapVehicleManufacturersResponse(await client.get('/api/v1/catalog/manufacturers'))

export default eventHandler((event) =>
  runVehicleCatalogHandler(event, () => fetchVehicleManufacturers(useVehicleCatalogClient()))
)
