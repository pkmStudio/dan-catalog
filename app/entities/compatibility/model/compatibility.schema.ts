import { z } from 'zod'

const applicationSummarySchema = z.object({
  modificationId: z.string().min(1),
  label: z.string().min(1)
})

export const compatibilityStatusSchema = z.enum(['compatible', 'incompatible', 'unknown'])

export const compatibilityResultSchema = z.object({
  productId: z.string().min(1),
  modificationId: z.string().min(1),
  status: compatibilityStatusSchema,
  message: z.string().min(1),
  applications: z.array(applicationSummarySchema)
})

export const compatibilityResponseSchema = z.object({ data: compatibilityResultSchema })

export type CompatibilityStatus = z.infer<typeof compatibilityStatusSchema>
export type CompatibilityResult = z.infer<typeof compatibilityResultSchema>
export type CompatibilityResponse = z.infer<typeof compatibilityResponseSchema>
