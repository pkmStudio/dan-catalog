import { z } from 'zod'

export const filterOptionSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
  count: z.number().int().nonnegative()
})

export const filterFacetSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  kind: z.enum(['enum', 'number']),
  options: z.array(filterOptionSchema).min(1)
})

export type FilterOption = z.infer<typeof filterOptionSchema>
export type FilterFacet = z.infer<typeof filterFacetSchema>
