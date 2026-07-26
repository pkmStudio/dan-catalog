import { z } from 'zod'

export const productGroupSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  icon: z.string().min(1),
  sortOrder: z.number().int().nonnegative(),
  categoryCount: z.number().int().nonnegative()
})

export const productGroupListResponseSchema = z.object({ data: z.array(productGroupSchema) })

export type ProductGroup = z.infer<typeof productGroupSchema>
export type ProductGroupListResponse = z.infer<typeof productGroupListResponseSchema>
