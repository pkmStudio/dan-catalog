export interface ProductGroup {
  id: string
  name: string
  icon: string
  count: number
}

export interface Product {
  id: string
  sku: string
  name: string
  categoryId: string
  image: string
  images: string[]
  type: string
  side: string
  length: number
  mount: string
  material: string
  warranty: string
  description: string
  oem: string[]
  analogs: string[]
  applications: string[]
}

export interface VehicleMake {
  id: string
  name: string
}

export interface VehicleModel {
  id: string
  makeId: string
  name: string
  generations: string[]
}

export interface VehicleSelection {
  makeId: string
  makeName: string
  modelId: string
  modelName: string
  modification: string
}

export interface CatalogFilters {
  types: string[]
  sides: string[]
  lengths: number[]
  mounts: string[]
}

export interface ContactRequest {
  name: string
  phone: string
  email?: string
  message: string
  productId?: string
  consent?: boolean
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  pages: number
}

export interface ApiResponse<T> {
  data: T
}
