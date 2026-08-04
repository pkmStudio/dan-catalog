import { z } from 'zod'

export const vehicleMakeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  sortOrder: z.number().int().nonnegative()
})

export const vehicleModelSchema = z.object({
  id: z.string().min(1),
  makeId: z.string().min(1),
  name: z.string().min(1),
  sortOrder: z.number().int().nonnegative()
})

export const vehicleModificationSchema = z
  .object({
    id: z.string().min(1),
    modelId: z.string().min(1),
    generation: z.string().min(1),
    yearFrom: z.number().int().min(1900),
    yearTo: z.number().int().min(1900).optional(),
    engine: z.string().min(1),
    powerHp: z.number().int().positive().optional(),
    displayName: z.string().min(1)
  })
  .refine(
    (modification) =>
      modification.yearTo === undefined || modification.yearTo >= modification.yearFrom,
    { message: 'Год окончания выпуска не может быть раньше года начала.', path: ['yearTo'] }
  )

export const vehicleContextSchema = z.object({
  make: vehicleMakeSchema,
  model: vehicleModelSchema,
  modification: vehicleModificationSchema,
  displayName: z.string().min(1)
})

export const applicationSummarySchema = z.object({
  modificationId: z.string().min(1),
  label: z.string().min(1)
})

export const vehicleMakeListResponseSchema = z.object({ data: z.array(vehicleMakeSchema) })
export const vehicleModelListResponseSchema = z.object({ data: z.array(vehicleModelSchema) })
export const vehicleModificationListResponseSchema = z.object({
  data: z.array(vehicleModificationSchema)
})

export type VehicleMake = z.infer<typeof vehicleMakeSchema>
export type VehicleModel = z.infer<typeof vehicleModelSchema>
export type VehicleModification = z.infer<typeof vehicleModificationSchema>
export type VehicleContext = z.infer<typeof vehicleContextSchema>
export type ApplicationSummary = z.infer<typeof applicationSummarySchema>
export type VehicleMakeListResponse = z.infer<typeof vehicleMakeListResponseSchema>
export type VehicleModelListResponse = z.infer<typeof vehicleModelListResponseSchema>
export type VehicleModificationListResponse = z.infer<typeof vehicleModificationListResponseSchema>
