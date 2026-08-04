const audiManufacturer = {
  id: 101,
  mfa_id: 50101,
  name: 'Audi'
} as const

const skodaManufacturer = {
  id: 102,
  mfa_id: 50102,
  name: 'Skoda'
} as const

const octaviaVehicle = {
  id: 1001,
  ms_id: 61001,
  manufacturer_id: skodaManufacturer.id,
  name: 'Octavia',
  localized_name: 'Октавия',
  generation: 'III (5E)',
  generation_short: 'A7',
  year_from: 2013,
  year_to: 2020
} as const

const superbVehicleWithNullableDetails = {
  id: 1002,
  ms_id: 61002,
  manufacturer_id: skodaManufacturer.id,
  name: 'Superb',
  localized_name: null,
  generation: null,
  generation_short: null,
  year_from: null,
  year_to: null
} as const

const newestModificationWithNullableDetails = {
  id: 9002,
  mod_id: 79002,
  vehicle_id: octaviaVehicle.id,
  ms_id: octaviaVehicle.ms_id,
  year_from: 2021,
  year_to: null,
  description: null,
  power_ps: null,
  power_kw: null,
  engine_type: null,
  gear_type: null,
  drive_type: null,
  brake_system_type: null,
  number_of_cylinders: null,
  capacity_lt: null
} as const

const octaviaModification = {
  id: 9001,
  mod_id: 79001,
  vehicle_id: octaviaVehicle.id,
  ms_id: octaviaVehicle.ms_id,
  year_from: 2018,
  year_to: 2020,
  description: '1.4 TSI',
  power_ps: 150,
  power_kw: 110,
  engine_type: 'Бензиновый двигатель',
  gear_type: 'Автоматическая коробка передач',
  drive_type: 'Привод на передние колеса',
  brake_system_type: 'Дисковой тормозной механизм',
  number_of_cylinders: 4,
  capacity_lt: 1.4
} as const

export const rawCatalogManufacturersResponse = {
  data: [audiManufacturer, skodaManufacturer]
} as const

export const rawCatalogVehiclesResponse = {
  data: [octaviaVehicle, superbVehicleWithNullableDetails]
} as const

export const rawCatalogModificationsResponse = {
  data: [newestModificationWithNullableDetails, octaviaModification]
} as const

export const rawCatalogModificationContextResponse = {
  data: {
    manufacturer: skodaManufacturer,
    vehicle: octaviaVehicle,
    modification: octaviaModification
  }
} as const
