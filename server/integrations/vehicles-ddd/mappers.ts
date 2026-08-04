import {
  rawCatalogVehicleListResponseSchema,
  rawVehicleManufacturerListResponseSchema,
  rawVehicleModificationContextResponseSchema,
  rawVehicleModificationListResponseSchema,
  type RawCatalogVehicle,
  type RawVehicleManufacturer,
  type RawVehicleModification
} from './schemas'
import { VehicleCatalogUpstreamError } from './errors'

export const mapVehicleManufacturer = (item: RawVehicleManufacturer) => ({
  id: item.id,
  mfaId: item.mfa_id,
  name: item.name
})

export const mapCatalogVehicle = (item: RawCatalogVehicle) => ({
  id: item.id,
  msId: item.ms_id,
  manufacturerId: item.manufacturer_id,
  name: item.name,
  localizedName: item.localized_name,
  generation: item.generation,
  generationShort: item.generation_short,
  carcase: item.type_carcase,
  yearFrom: item.year_from,
  yearTo: item.year_to
})

export const mapVehicleModification = (item: RawVehicleModification) => ({
  id: item.id,
  modId: item.mod_id,
  vehicleId: item.vehicle_id,
  msId: item.ms_id,
  yearFrom: item.year_from,
  yearTo: item.year_to,
  description: item.description,
  powerPs: item.power_ps,
  powerKw: item.power_kw,
  engineType: item.engine_type,
  gearType: item.gear_type,
  driveType: item.drive_type,
  brakeSystemType: item.brake_system_type,
  numberOfCylinders: item.number_of_cylinders,
  capacityLt: item.capacity_lt
})

export const mapVehicleManufacturersResponse = (value: unknown) => ({
  data: rawVehicleManufacturerListResponseSchema.parse(value).data.map(mapVehicleManufacturer)
})

export const mapManufacturerVehiclesResponse = (value: unknown, manufacturerId: number) => {
  const data = rawCatalogVehicleListResponseSchema.parse(value).data
  if (data.some((item) => item.manufacturer_id !== manufacturerId)) {
    throw new VehicleCatalogUpstreamError('bad-response')
  }
  return { data: data.map(mapCatalogVehicle) }
}

export const mapVehicleModificationsResponse = (value: unknown, vehicleId: number) => {
  const data = rawVehicleModificationListResponseSchema.parse(value).data
  if (data.some((item) => item.vehicle_id !== vehicleId)) {
    throw new VehicleCatalogUpstreamError('bad-response')
  }
  return { data: data.map(mapVehicleModification) }
}

export const mapVehicleModificationContextResponse = (value: unknown) => {
  const { manufacturer, vehicle, modification } =
    rawVehicleModificationContextResponseSchema.parse(value).data
  if (vehicle.manufacturer_id !== manufacturer.id || modification.vehicle_id !== vehicle.id) {
    throw new VehicleCatalogUpstreamError('bad-response')
  }
  return {
    data: {
      manufacturer: mapVehicleManufacturer(manufacturer),
      vehicle: mapCatalogVehicle(vehicle),
      modification: mapVehicleModification(modification)
    }
  }
}
