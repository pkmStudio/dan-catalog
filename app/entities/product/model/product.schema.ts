import { z } from 'zod'

export const productSummarySchema = z.object({
  id: z.string().min(1),
  sku: z.string().min(1),
  name: z.string().min(1),
  image: z.string().min(1)
})

export const productImageSchema = z.object({
  src: z.string().min(1),
  alt: z.string(),
  thumbnailSrc: z.string().min(1).optional(),
  sortOrder: z.number().int().nonnegative()
})

export const productSpecificationSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  value: z.union([z.string(), z.number()]),
  unit: z.string().optional(),
  filterable: z.boolean()
})

export const productAnalogSchema = z.object({
  id: z.string().min(1),
  sku: z.string().min(1),
  name: z.string().min(1),
  productId: z.string().min(1).optional(),
  manufacturer: z.string().optional()
})

export const applicationSummarySchema = z.object({
  modificationId: z.string().min(1),
  label: z.string().min(1)
})

export const seoDocumentSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  canonicalPath: z.string().startsWith('/')
})

export const productSchema = productSummarySchema.extend({
  categoryId: z.string().min(1),
  description: z.string().min(1),
  images: z.array(productImageSchema).min(1),
  specifications: z.array(productSpecificationSchema),
  oemNumbers: z.array(z.string()),
  analogs: z.array(productAnalogSchema),
  applications: z.array(applicationSummarySchema),
  seo: seoDocumentSchema
})

const filterFacetSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  kind: z.enum(['enum', 'number']),
  options: z
    .array(
      z.object({
        value: z.string().min(1),
        label: z.string().min(1),
        count: z.number().int().nonnegative()
      })
    )
    .min(1)
})

export const productResponseSchema = z.object({ data: productSchema })
export const productPageSchema = z.object({
  categoryName: z.string().min(1),
  categoryDescription: z.string(),
  items: z.array(productSummarySchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.literal(9),
  pageCount: z.number().int().nonnegative(),
  facets: z.array(filterFacetSchema)
})
export const productPageResponseSchema = z.object({ data: productPageSchema })

export const searchMatchSchema = z.enum(['exact', 'multiple', 'empty'])

export const searchResultSchema = z.object({
  match: searchMatchSchema,
  items: z.array(productSummarySchema).max(20)
})

export const searchResponseSchema = z.object({
  data: searchResultSchema
})

export type ProductSummary = z.infer<typeof productSummarySchema>
export type ProductImage = z.infer<typeof productImageSchema>
export type ProductSpecification = z.infer<typeof productSpecificationSchema>
export type ProductAnalog = z.infer<typeof productAnalogSchema>
export type ApplicationSummary = z.infer<typeof applicationSummarySchema>
export type SeoDocument = z.infer<typeof seoDocumentSchema>
export type Product = z.infer<typeof productSchema>
export type ProductResponse = z.infer<typeof productResponseSchema>
export type ProductPage = z.infer<typeof productPageSchema>
export type ProductPageResponse = z.infer<typeof productPageResponseSchema>
export type SearchMatch = z.infer<typeof searchMatchSchema>
export type SearchResult = z.infer<typeof searchResultSchema>
export type SearchResponse = z.infer<typeof searchResponseSchema>
