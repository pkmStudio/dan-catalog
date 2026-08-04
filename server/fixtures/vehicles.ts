export interface VehicleMakeFixture {
  id: string
  name: string
  sortOrder: number
}

export interface VehicleModelFixture {
  id: string
  makeId: string
  name: string
  sortOrder: number
}

export interface VehicleModificationFixture {
  id: string
  modelId: string
  generation: string
  yearFrom: number
  yearTo?: number
  engine: string
  powerHp?: number
  displayName: string
}

export type CompatibilityFixtureStatus = 'compatible' | 'incompatible' | 'unknown'

export interface CompatibilityFixture {
  productId: string
  modificationId: string
  status: CompatibilityFixtureStatus
}

export const makes: VehicleMakeFixture[] = [
  'Toyota',
  'Honda',
  'Mazda',
  'Nissan',
  'Subaru',
  'Kia',
  'Hyundai',
  'Volkswagen'
].map((name, sortOrder) => ({
  id: name.toLowerCase(),
  name,
  sortOrder
}))

export const models: VehicleModelFixture[] = [
  { id: 'camry', makeId: 'toyota', name: 'Camry', sortOrder: 0 },
  { id: 'rav4', makeId: 'toyota', name: 'RAV4', sortOrder: 1 },
  { id: 'corolla', makeId: 'toyota', name: 'Corolla', sortOrder: 2 },
  { id: 'crv', makeId: 'honda', name: 'CR-V', sortOrder: 0 },
  { id: 'cx5', makeId: 'mazda', name: 'CX-5', sortOrder: 0 }
]

export const modifications: VehicleModificationFixture[] = [
  {
    id: 'toyota-camry-xv70-25',
    modelId: 'camry',
    generation: 'XV70',
    yearFrom: 2018,
    yearTo: 2023,
    engine: '2.5 бензин',
    powerHp: 181,
    displayName: 'XV70 · 2.5 бензин · 181 л.с. · 2018–2023'
  },
  {
    id: 'toyota-camry-xv50-25',
    modelId: 'camry',
    generation: 'XV50',
    yearFrom: 2011,
    yearTo: 2017,
    engine: '2.5 бензин',
    powerHp: 181,
    displayName: 'XV50 · 2.5 бензин · 181 л.с. · 2011–2017'
  },
  {
    id: 'toyota-rav4-xa50-20',
    modelId: 'rav4',
    generation: 'XA50',
    yearFrom: 2019,
    yearTo: 2024,
    engine: '2.0 бензин',
    powerHp: 149,
    displayName: 'XA50 · 2.0 бензин · 149 л.с. · 2019–2024'
  },
  {
    id: 'honda-crv-rw-24',
    modelId: 'crv',
    generation: 'RW',
    yearFrom: 2017,
    yearTo: 2022,
    engine: '2.4 бензин',
    powerHp: 186,
    displayName: 'RW · 2.4 бензин · 186 л.с. · 2017–2022'
  },
  {
    id: 'mazda-cx5-kf-25',
    modelId: 'cx5',
    generation: 'KF',
    yearFrom: 2017,
    yearTo: 2024,
    engine: '2.5 бензин',
    powerHp: 194,
    displayName: 'KF · 2.5 бензин · 194 л.с. · 2017–2024'
  }
]

export const applicableCategoryIdsByModification: Record<string, string[]> = {
  'toyota-camry-xv70-25': ['wipers', 'brake-pads'],
  'toyota-camry-xv50-25': ['wipers'],
  'toyota-rav4-xa50-20': ['wipers', 'brake-pads', 'brake-discs'],
  'honda-crv-rw-24': ['wipers'],
  'mazda-cx5-kf-25': []
}

export const compatibility: CompatibilityFixture[] = [
  {
    productId: 'lw-600',
    modificationId: 'toyota-camry-xv70-25',
    status: 'compatible'
  },
  {
    productId: 'dan-wb-002',
    modificationId: 'toyota-camry-xv70-25',
    status: 'incompatible'
  },
  {
    productId: 'dan-wb-003',
    modificationId: 'toyota-camry-xv70-25',
    status: 'unknown'
  }
]
