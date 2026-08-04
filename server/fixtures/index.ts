export {
  categories as catalogCategories,
  groups as catalogGroups,
  products as catalogProducts,
  wiperFacets
} from './catalog'
export type {
  CatalogFixtureCategory,
  CatalogFixtureFacet,
  CatalogFixtureGroup,
  CatalogFixtureProduct
} from './catalog'
export { aboutContent, contactContent } from './content'
export type { ContentSectionFixture } from './content'
export {
  applicableCategoryIdsByModification,
  compatibility as vehicleCompatibility,
  makes as vehicleMakes,
  models as vehicleModels,
  modifications as vehicleModifications
} from './vehicles'
export type {
  CompatibilityFixture,
  CompatibilityFixtureStatus,
  VehicleMakeFixture,
  VehicleModelFixture,
  VehicleModificationFixture
} from './vehicles'
