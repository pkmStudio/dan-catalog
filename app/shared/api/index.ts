export { apiRequest } from './client'
export type { ApiRequestOptions, ResponseParser } from './client'
export {
  createInquiry,
  endpointRegistry,
  getAboutContent,
  getCategoryProducts,
  getContactContent,
  getGroupCategories,
  getProduct,
  getProductGroups,
  getManufacturerVehicles,
  getVehicleManufacturers,
  getVehicleModificationContext,
  getVehicleModifications,
  vehicleEndpointRegistry,
  searchProducts
} from './endpoints'
export type { CategoryProductsQuery } from './endpoints'
export { AppError, getSafeErrorMessage, normalizeAppError } from './error'
export type { AppErrorDetails } from './error'
