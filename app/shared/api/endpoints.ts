type QueryValue = string | number | readonly string[] | undefined

const encodePath = (value: string): string => encodeURIComponent(value)

const withQuery = (path: string, query: Record<string, QueryValue>): string => {
  const params = new URLSearchParams()

  for (const key of Object.keys(query).sort()) {
    const value = query[key]
    if (value === undefined || value === '') continue

    const values = Array.isArray(value) ? value : [value]
    for (const item of values) params.append(key, String(item))
  }

  const serialized = params.toString()
  return serialized ? `${path}?${serialized}` : path
}

export interface CategoryProductsQuery {
  filter?: readonly string[]
  page?: number
  pageSize?: 9
  vehicleModificationId?: number
}

export const vehicleEndpointRegistry = {
  getVehicleManufacturers: () => '/vehicles/manufacturers',
  getManufacturerVehicles: (manufacturerId: number) =>
    `/vehicles/manufacturers/${manufacturerId}/vehicles`,
  getVehicleModifications: (vehicleId: number) => `/vehicles/${vehicleId}/modifications`,
  getVehicleModificationContext: (modificationId: number) =>
    `/vehicles/modifications/${modificationId}`
} as const

export const endpointRegistry = {
  getProductGroups: () => '/catalog/groups',
  getGroupCategories: (groupId: string, vehicleModificationId?: string) =>
    withQuery(`/catalog/groups/${encodePath(groupId)}/categories`, { vehicleModificationId }),
  getCategoryProducts: (slug: string, query: CategoryProductsQuery = {}) =>
    withQuery(`/catalog/categories/${encodePath(slug)}/products`, {
      filter: query.filter,
      page: query.page,
      pageSize: query.pageSize,
      vehicleModificationId: query.vehicleModificationId
    }),
  getProduct: (productId: string) => `/catalog/products/${encodePath(productId)}`,
  searchProducts: (query: string, limit = 8) => withQuery('/catalog/search', { limit, q: query }),
  ...vehicleEndpointRegistry,
  getAboutContent: () => '/content/about',
  getContactContent: () => '/content/contacts',
  createInquiry: () => '/inquiries'
} as const

export const {
  createInquiry,
  getAboutContent,
  getCategoryProducts,
  getContactContent,
  getGroupCategories,
  getManufacturerVehicles,
  getProduct,
  getProductGroups,
  getVehicleManufacturers,
  getVehicleModificationContext,
  getVehicleModifications,
  searchProducts
} = endpointRegistry
