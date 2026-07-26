import { z } from 'zod'
import { filterFacetSchema, type FilterFacet } from '~/entities/category'

export const categorySchema = z.object({
  id: z.string().min(1),
  groupId: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  image: z.string().min(1),
  productCount: z.number().int().nonnegative(),
  filterFacets: z.array(filterFacetSchema).optional()
})

export const categoryListResponseSchema = z.object({ data: z.array(categorySchema) })

export const paginatedResultSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    total: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    pageSize: z.literal(9),
    pageCount: z.number().int().nonnegative(),
    facets: z.array(filterFacetSchema).optional()
  })

export type Category = z.infer<typeof categorySchema>
export type CategoryListResponse = z.infer<typeof categoryListResponseSchema>
export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: 9
  pageCount: number
  facets?: FilterFacet[]
}
