import type {CatalogFilters} from '~/types/catalog'

export const useCatalogFilters = () => useState<CatalogFilters>('catalog-filters', () => ({
    types: [],
    sides: [],
    lengths: [],
    mounts: []
}))
