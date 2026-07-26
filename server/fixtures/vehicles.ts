export interface VehicleMakeFixture {
  id: string
  name: string
}

export interface VehicleModelFixture {
  id: string
  makeId: string
  name: string
  generations: string[]
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
].map((name) => ({
  id: name.toLowerCase(),
  name
}))

export const models: VehicleModelFixture[] = [
  {
    id: 'camry',
    makeId: 'toyota',
    name: 'Camry',
    generations: ['XV70 · 2.5 бензин · 181 л.с. · 2018–2023', 'XV50 · 2.5 бензин · 2011–2017']
  },
  {
    id: 'rav4',
    makeId: 'toyota',
    name: 'RAV4',
    generations: ['XA50 · 2.0 бензин · 2019–2024', 'XA40 · 2.5 бензин · 2013–2019']
  },
  {
    id: 'corolla',
    makeId: 'toyota',
    name: 'Corolla',
    generations: ['E210 · 1.6 бензин · 2018–2024']
  },
  {
    id: 'crv',
    makeId: 'honda',
    name: 'CR-V',
    generations: ['RW · 2.4 бензин · 2017–2022']
  },
  {
    id: 'cx5',
    makeId: 'mazda',
    name: 'CX-5',
    generations: ['KF · 2.5 бензин · 2017–2024']
  }
]
