import { z } from 'zod'

const positiveId = z.number().int().positive()
const nullableText = z.string().trim().min(1).nullable()

export const vehicleManufacturerSchema = z
  .object({
    id: positiveId,
    mfaId: z.number().int(),
    name: z.string().trim().min(1)
  })
  .strict()

export const catalogVehicleSchema = z
  .object({
    id: positiveId,
    msId: z.number().int(),
    manufacturerId: positiveId,
    name: z.string().trim().min(1),
    localizedName: nullableText,
    generation: nullableText,
    generationShort: nullableText,
    carcase: z.string().trim().min(1),
    yearFrom: z.number().int().nullable(),
    yearTo: z.number().int().nullable()
  })
  .strict()

export const vehicleModificationSchema = z
  .object({
    id: positiveId,
    modId: z.number().int(),
    vehicleId: positiveId,
    msId: z.number().int(),
    yearFrom: z.number().int().nullable(),
    yearTo: z.number().int().nullable(),
    description: nullableText,
    powerPs: z.number().int().nonnegative().nullable(),
    powerKw: z.number().int().nonnegative().nullable(),
    engineType: nullableText,
    gearType: nullableText,
    driveType: nullableText,
    brakeSystemType: nullableText,
    numberOfCylinders: z.number().int().positive().nullable(),
    capacityLt: z.number().nonnegative().nullable()
  })
  .strict()

export const vehicleModificationContextSchema = z
  .object({
    manufacturer: vehicleManufacturerSchema,
    vehicle: catalogVehicleSchema,
    modification: vehicleModificationSchema
  })
  .strict()

export const vehicleManufacturerListResponseSchema = z.object({
  data: z.array(vehicleManufacturerSchema)
})
export const catalogVehicleListResponseSchema = z.object({ data: z.array(catalogVehicleSchema) })
export const vehicleModificationListResponseSchema = z.object({
  data: z.array(vehicleModificationSchema)
})
export const vehicleModificationContextResponseSchema = z.object({
  data: vehicleModificationContextSchema
})

export type VehicleManufacturer = z.infer<typeof vehicleManufacturerSchema>
export type CatalogVehicle = z.infer<typeof catalogVehicleSchema>
export type VehicleModification = z.infer<typeof vehicleModificationSchema>
export type VehicleModificationContext = z.infer<typeof vehicleModificationContextSchema>
export type VehicleContext = VehicleModificationContext & { displayName: string }
export type VehicleManufacturerListResponse = z.infer<typeof vehicleManufacturerListResponseSchema>
export type CatalogVehicleListResponse = z.infer<typeof catalogVehicleListResponseSchema>
export type VehicleModificationListResponse = z.infer<typeof vehicleModificationListResponseSchema>
export type VehicleModificationContextResponse = z.infer<
  typeof vehicleModificationContextResponseSchema
>
