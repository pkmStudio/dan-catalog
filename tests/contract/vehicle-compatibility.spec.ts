import { describe, expect, it } from 'vitest'
import { categoryListResponseSchema } from '~/entities/category'
import {
  compatibilityResponseSchema,
  type CompatibilityStatus
} from '~/entities/compatibility/model'
import {
  vehicleMakeListResponseSchema,
  vehicleModelListResponseSchema,
  vehicleModificationListResponseSchema
} from '~/entities/vehicle/model'
import { buildProductCompatibilityResponse } from '~~/server/api/catalog/products/[productId]/compatibility.get'
import { buildVehicleMakesResponse } from '~~/server/api/vehicles/makes.get'
import { buildVehicleModelsResponse } from '~~/server/api/vehicles/makes/[makeId]/models.get'
import { buildVehicleModificationsResponse } from '~~/server/api/vehicles/models/[modelId]/modifications.get'
import { buildModificationCategoriesResponse } from '~~/server/api/vehicles/modifications/[modificationId]/categories.get'

describe('vehicle and compatibility contracts', () => {
  it('returns dependent makes, models and modifications', () => {
    const makes = vehicleMakeListResponseSchema.parse(buildVehicleMakesResponse())
    const models = vehicleModelListResponseSchema.parse(buildVehicleModelsResponse('toyota'))
    const modifications = vehicleModificationListResponseSchema.parse(
      buildVehicleModificationsResponse('camry')
    )

    expect(makes.data.map((make) => make.id)).toContain('toyota')
    expect(models.data.every((model) => model.makeId === 'toyota')).toBe(true)
    expect(modifications.data.every((modification) => modification.modelId === 'camry')).toBe(true)
  })

  it('covers empty dependent branches and empty applicable categories', () => {
    const models = vehicleModelListResponseSchema.parse(buildVehicleModelsResponse('nissan'))
    const categories = categoryListResponseSchema.parse(
      buildModificationCategoriesResponse('mazda-cx5-kf-25')
    )

    expect(models.data).toEqual([])
    expect(categories.data).toEqual([])
  })

  it('returns categories applicable to the selected modification', () => {
    const response = categoryListResponseSchema.parse(
      buildModificationCategoriesResponse('toyota-camry-xv70-25')
    )

    expect(response.data.map((category) => category.slug)).toEqual(['wipers', 'brake-pads'])
  })

  it.each([
    ['lw-600', 'compatible'],
    ['dan-wb-002', 'incompatible'],
    ['dan-wb-003', 'unknown']
  ] as const)('returns %s as %s without boolean fallback', (productId, status) => {
    const response = compatibilityResponseSchema.parse(
      buildProductCompatibilityResponse(productId, 'toyota-camry-xv70-25')
    )

    expect(response.data.status).toBe<CompatibilityStatus>(status)
    expect(response.data).not.toHaveProperty('compatible')
  })

  it('rejects unknown dictionary and compatibility identifiers', () => {
    expect(() => buildVehicleModelsResponse('missing')).toThrow()
    expect(() => buildVehicleModificationsResponse('missing')).toThrow()
    expect(() => buildModificationCategoriesResponse('missing')).toThrow()
    expect(() => buildProductCompatibilityResponse('lw-600', 'missing-modification')).toThrow()
  })
})
