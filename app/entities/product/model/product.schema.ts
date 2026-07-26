import { z } from 'zod'

export const productSummarySchema = z.object({
  id: z.string().min(1),
  sku: z.string().min(1),
  name: z.string().min(1),
  image: z.string().min(1)
})

export const searchMatchSchema = z.enum(['exact', 'multiple', 'empty'])

export const searchResultSchema = z.object({
  match: searchMatchSchema,
  items: z.array(productSummarySchema).max(20)
})

export const searchResponseSchema = z.object({
  data: searchResultSchema
})

export type ProductSummary = z.infer<typeof productSummarySchema>
export type SearchMatch = z.infer<typeof searchMatchSchema>
export type SearchResult = z.infer<typeof searchResultSchema>
export type SearchResponse = z.infer<typeof searchResponseSchema>
