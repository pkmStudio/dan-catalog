import type {
  CatalogVehicle,
  VehicleContext,
  VehicleManufacturer,
  VehicleModification,
  VehicleModificationContext
} from './vehicle.schema'

const compact = (parts: Array<string | undefined | null>): string =>
  parts.filter(Boolean).join(' · ')

export const formatVehicleYears = (yearFrom: number | null, yearTo: number | null): string => {
  if (yearFrom !== null && yearTo !== null) return `${yearFrom}–${yearTo}`
  if (yearFrom !== null) return `с ${yearFrom}`
  if (yearTo !== null) return `до ${yearTo}`
  return ''
}

export const formatCatalogVehicle = (vehicle: CatalogVehicle): string =>
  compact([
    vehicle.name,
    vehicle.generation,
    formatVehicleYears(vehicle.yearFrom, vehicle.yearTo),
    vehicle.carcase
  ])

export const formatVehicleModification = (modification: VehicleModification): string =>
  compact([
    modification.description,
    modification.capacityLt === null ? null : `${modification.capacityLt} л`,
    modification.powerPs === null ? null : `${modification.powerPs} л.с.`,
    modification.engineType,
    modification.gearType,
    formatVehicleYears(modification.yearFrom, modification.yearTo)
  ]) || `Модификация ${modification.id}`

export const createVehicleContext = (
  manufacturer: VehicleManufacturer,
  vehicle: CatalogVehicle,
  modification: VehicleModification
): VehicleContext => ({
  manufacturer,
  vehicle,
  modification,
  displayName: compact([
    manufacturer.name,
    formatCatalogVehicle(vehicle),
    formatVehicleModification(modification)
  ])
})

export const enrichVehicleContext = (context: VehicleModificationContext): VehicleContext =>
  createVehicleContext(context.manufacturer, context.vehicle, context.modification)
