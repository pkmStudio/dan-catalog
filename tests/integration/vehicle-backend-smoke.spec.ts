import { describe, expect, it } from 'vitest'
import {
  catalogVehicleListResponseSchema,
  vehicleManufacturerListResponseSchema,
  vehicleModificationContextResponseSchema,
  vehicleModificationListResponseSchema
} from '~/entities/vehicle'

const enabled = process.env.LIVE_VEHICLE_BACKEND === '1'
const baseUrl = (process.env.VEHICLE_BFF_BASE_URL ?? 'http://127.0.0.1:3000/api').replace(
  /\/+$/u,
  ''
)

const getJson = async (path: string): Promise<unknown> => {
  const response = await fetch(`${baseUrl}${path}`)
  expect(response.ok).toBe(true)
  return await response.json()
}

describe.skipIf(!enabled)('controlled vehicle BFF integration', () => {
  it('reads all four live operations through the BFF', async () => {
    const manufacturers = vehicleManufacturerListResponseSchema.parse(
      await getJson('/vehicles/manufacturers')
    ).data
    expect(manufacturers.length).toBeGreaterThan(0)

    const vehicles = catalogVehicleListResponseSchema.parse(
      await getJson(`/vehicles/manufacturers/${manufacturers[0]!.id}/vehicles`)
    ).data
    expect(vehicles.length).toBeGreaterThan(0)

    const modifications = vehicleModificationListResponseSchema.parse(
      await getJson(`/vehicles/${vehicles[0]!.id}/modifications`)
    ).data
    expect(modifications.length).toBeGreaterThan(0)

    const context = vehicleModificationContextResponseSchema.parse(
      await getJson(`/vehicles/modifications/${modifications[0]!.id}`)
    ).data
    expect(context.modification.id).toBe(modifications[0]!.id)
  })
})
