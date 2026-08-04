import { describe, expect, it } from 'vitest'
import {
  formatCatalogVehicle,
  formatVehicleModification,
  vehicleModificationContextResponseSchema
} from '~/entities/vehicle'
import {
  rawCatalogModificationContextResponse,
  rawCatalogModificationsResponse,
  rawCatalogVehiclesResponse
} from '../../fixtures/vehicle-catalog'
import {
  mapManufacturerVehiclesResponse,
  mapVehicleModificationContextResponse,
  mapVehicleModificationsResponse
} from '~~/server/integrations/vehicles-ddd/mappers'
import { VehicleCatalogUpstreamError } from '~~/server/integrations/vehicles-ddd/errors'

describe('vehicle catalog mappers', () => {
  it('maps exact upstream fields, preserves order and nullable values', () => {
    const vehicles = mapManufacturerVehiclesResponse(rawCatalogVehiclesResponse, 102).data
    const modifications = mapVehicleModificationsResponse(
      rawCatalogModificationsResponse,
      1001
    ).data

    expect(vehicles.map((item) => item.id)).toEqual([1001, 1002])
    expect(vehicles[1]).toMatchObject({
      localizedName: null,
      generation: null,
      carcase: 'Estate',
      yearFrom: null
    })
    expect(modifications.map((item) => item.id)).toEqual([9002, 9001])
    expect(modifications[0]?.description).toBeNull()
  })

  it('rejects inconsistent parent relationships', () => {
    expect(() => mapManufacturerVehiclesResponse(rawCatalogVehiclesResponse, 101)).toThrow(
      VehicleCatalogUpstreamError
    )
    expect(() => mapVehicleModificationsResponse(rawCatalogModificationsResponse, 999)).toThrow(
      VehicleCatalogUpstreamError
    )
  })

  it('maps and validates a consistent context', () => {
    const response = mapVehicleModificationContextResponse(rawCatalogModificationContextResponse)
    expect(vehicleModificationContextResponseSchema.parse(response).data).toMatchObject({
      manufacturer: { id: 102 },
      vehicle: { id: 1001, manufacturerId: 102, carcase: 'Hatchback' },
      modification: { id: 9001, vehicleId: 1001 }
    })
  })

  it('builds readable labels without inventing nullable details', () => {
    const vehicles = mapManufacturerVehiclesResponse(rawCatalogVehiclesResponse, 102).data
    const modifications = mapVehicleModificationsResponse(
      rawCatalogModificationsResponse,
      1001
    ).data
    expect(formatCatalogVehicle(vehicles[1]!)).toBe('Superb · Estate')
    expect(formatVehicleModification(modifications[0]!)).toBe('с 2021')
  })
})
