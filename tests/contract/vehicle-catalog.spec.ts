import { describe, expect, it } from 'vitest'
import {
  catalogVehicleListResponseSchema,
  vehicleManufacturerListResponseSchema,
  vehicleModificationContextResponseSchema,
  vehicleModificationListResponseSchema
} from '~/entities/vehicle'
import {
  rawCatalogManufacturersResponse,
  rawCatalogModificationContextResponse,
  rawCatalogModificationsResponse,
  rawCatalogVehiclesResponse
} from '../fixtures/vehicle-catalog'
import { fetchVehicleManufacturers } from '~~/server/api/vehicles/manufacturers.get'
import { fetchManufacturerVehicles } from '~~/server/api/vehicles/manufacturers/[manufacturerId]/vehicles.get'
import { fetchVehicleModifications } from '~~/server/api/vehicles/[vehicleId]/modifications.get'
import { fetchVehicleModificationContext } from '~~/server/api/vehicles/modifications/[modificationId].get'
import type { VehicleCatalogClient } from '~~/server/integrations/vehicles-ddd/client'
import {
  toSafeVehicleCatalogError,
  VehicleCatalogUpstreamError
} from '~~/server/integrations/vehicles-ddd/errors'

const clientReturning = (value: unknown): VehicleCatalogClient => ({ get: async () => value })

describe('vehicle catalog BFF contract', () => {
  it('maps all four list/detail operations through an injected upstream transport', async () => {
    const manufacturers = vehicleManufacturerListResponseSchema.parse(
      await fetchVehicleManufacturers(clientReturning(rawCatalogManufacturersResponse))
    )
    const vehicles = catalogVehicleListResponseSchema.parse(
      await fetchManufacturerVehicles(clientReturning(rawCatalogVehiclesResponse), 102)
    )
    const modifications = vehicleModificationListResponseSchema.parse(
      await fetchVehicleModifications(clientReturning(rawCatalogModificationsResponse), 1001)
    )
    const context = vehicleModificationContextResponseSchema.parse(
      await fetchVehicleModificationContext(
        clientReturning(rawCatalogModificationContextResponse),
        9001
      )
    )

    expect(manufacturers.data.map((item) => item.id)).toEqual([101, 102])
    expect(vehicles.data.every((item) => item.manufacturerId === 102)).toBe(true)
    expect(modifications.data.every((item) => item.vehicleId === 1001)).toBe(true)
    expect(context.data.modification.id).toBe(9001)
  })

  it('rejects malformed upstream JSON before it reaches the browser contract', async () => {
    await expect(
      fetchVehicleManufacturers(clientReturning({ data: [{ id: 'secret' }] }))
    ).rejects.toThrow()
  })

  it.each([
    ['network', 502, 'VEHICLE_CATALOG_UNAVAILABLE'],
    ['timeout', 503, 'VEHICLE_CATALOG_TIMEOUT'],
    ['bad-response', 502, 'VEHICLE_CATALOG_BAD_RESPONSE'],
    ['not-found', 404, 'VEHICLE_NOT_FOUND']
  ] as const)('normalizes %s failures to a safe public envelope', (kind, status, code) => {
    const error = toSafeVehicleCatalogError(
      new VehicleCatalogUpstreamError(kind, undefined, {
        cause: new Error('X-Service-Key secret https://internal.example/raw')
      }),
      'request-123'
    )
    const serialized = JSON.stringify(error.data)

    expect(error.statusCode).toBe(status)
    expect(error.data).toMatchObject({
      error: { code, requestId: 'request-123' }
    })
    expect(serialized).not.toMatch(/X-Service-Key|secret|internal\.example|\/raw/u)
  })
})
