import { z } from 'zod'

const positiveId = z.number().int().positive()
const nullableText = z.string().trim().min(1).nullable()

export const rawVehicleManufacturerSchema = z
  .object({
    id: positiveId,
    mfa_id: z.number().int(),
    name: z.string().trim().min(1)
  })
  .strict()

export const rawCatalogVehicleSchema = z
  .object({
    id: positiveId,
    ms_id: z.number().int(),
    manufacturer_id: positiveId,
    name: z.string().trim().min(1),
    localized_name: nullableText,
    generation: nullableText,
    generation_short: nullableText,
    type_carcase: z.string().trim().min(1),
    year_from: z.number().int().nullable(),
    year_to: z.number().int().nullable()
  })
  .strict()

export const rawVehicleModificationSchema = z
  .object({
    id: positiveId,
    mod_id: z.number().int(),
    vehicle_id: positiveId,
    ms_id: z.number().int(),
    year_from: z.number().int().nullable(),
    year_to: z.number().int().nullable(),
    description: nullableText,
    power_ps: z.number().int().nonnegative().nullable(),
    power_kw: z.number().int().nonnegative().nullable(),
    engine_type: nullableText,
    gear_type: nullableText,
    drive_type: nullableText,
    brake_system_type: nullableText,
    number_of_cylinders: z.number().int().positive().nullable(),
    capacity_lt: z.number().nonnegative().nullable()
  })
  .strict()

export const rawVehicleManufacturerListResponseSchema = z
  .object({ data: z.array(rawVehicleManufacturerSchema) })
  .strict()
export const rawCatalogVehicleListResponseSchema = z
  .object({ data: z.array(rawCatalogVehicleSchema) })
  .strict()
export const rawVehicleModificationListResponseSchema = z
  .object({ data: z.array(rawVehicleModificationSchema) })
  .strict()
export const rawVehicleModificationContextResponseSchema = z
  .object({
    data: z
      .object({
        manufacturer: rawVehicleManufacturerSchema,
        vehicle: rawCatalogVehicleSchema,
        modification: rawVehicleModificationSchema
      })
      .strict()
  })
  .strict()

export type RawVehicleManufacturer = z.infer<typeof rawVehicleManufacturerSchema>
export type RawCatalogVehicle = z.infer<typeof rawCatalogVehicleSchema>
export type RawVehicleModification = z.infer<typeof rawVehicleModificationSchema>
