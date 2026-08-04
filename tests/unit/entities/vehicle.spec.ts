import { describe, expect, it } from 'vitest'
import {
  catalogVehicleSchema,
  createVehicleContext,
  vehicleManufacturerSchema,
  vehicleModificationSchema
} from '~/entities/vehicle'

describe('vehicle entity', () => {
  it('requires numeric positive internal IDs', () => {
    expect(() => vehicleManufacturerSchema.parse({ id: '1', mfaId: 2, name: 'DAN' })).toThrow()
    expect(() => vehicleManufacturerSchema.parse({ id: 0, mfaId: 2, name: 'DAN' })).toThrow()
  })

  it('creates a readable context from nullable backend fields', () => {
    const manufacturer = vehicleManufacturerSchema.parse({ id: 1, mfaId: 2, name: 'Skoda' })
    const vehicle = catalogVehicleSchema.parse({
      id: 10,
      msId: 20,
      manufacturerId: 1,
      name: 'Superb',
      localizedName: null,
      generation: null,
      generationShort: null,
      carcase: 'Estate',
      yearFrom: null,
      yearTo: null
    })
    const modification = vehicleModificationSchema.parse({
      id: 100,
      modId: 200,
      vehicleId: 10,
      msId: 20,
      yearFrom: null,
      yearTo: null,
      description: null,
      powerPs: null,
      powerKw: null,
      engineType: null,
      gearType: null,
      driveType: null,
      brakeSystemType: null,
      numberOfCylinders: null,
      capacityLt: null
    })
    expect(createVehicleContext(manufacturer, vehicle, modification).displayName).toBe(
      'Skoda · Superb · Estate · Модификация 100'
    )
  })
})
