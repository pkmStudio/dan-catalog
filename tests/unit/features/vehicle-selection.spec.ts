import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AppError } from '~/shared/api'
import {
  createVehicleContext,
  type CatalogVehicle,
  type VehicleManufacturer,
  type VehicleModification
} from '~/entities/vehicle'
import {
  useVehicleSelectionStore,
  type VehicleDictionaryApi
} from '~/features/select-vehicle/model'

const manufacturers: VehicleManufacturer[] = [
  { id: 101, mfaId: 50101, name: 'Audi' },
  { id: 102, mfaId: 50102, name: 'Skoda' }
]
const vehicles: CatalogVehicle[] = [
  {
    id: 1001,
    msId: 61001,
    manufacturerId: 102,
    name: 'Octavia',
    localizedName: 'Октавия',
    generation: 'III',
    generationShort: 'A7',
    carcase: 'Hatchback',
    yearFrom: 2013,
    yearTo: 2020
  }
]
const modifications: VehicleModification[] = [
  {
    id: 9001,
    modId: 79001,
    vehicleId: 1001,
    msId: 61001,
    yearFrom: 2018,
    yearTo: 2020,
    description: '1.4 TSI',
    powerPs: 150,
    powerKw: 110,
    engineType: 'Бензин',
    gearType: 'АКПП',
    driveType: 'Передний',
    brakeSystemType: null,
    numberOfCylinders: 4,
    capacityLt: 1.4
  }
]
const context = createVehicleContext(manufacturers[1]!, vehicles[0]!, modifications[0]!)

const api: VehicleDictionaryApi = {
  getManufacturers: vi.fn(async () => manufacturers),
  getVehicles: vi.fn(async (manufacturerId) =>
    vehicles.filter((item) => item.manufacturerId === manufacturerId)
  ),
  getModifications: vi.fn(async (vehicleId) =>
    modifications.filter((item) => item.vehicleId === vehicleId)
  ),
  getModificationContext: vi.fn(async () => context)
}

const deferred = <T>() => {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((done) => {
    resolve = done
  })
  return { promise, resolve }
}

describe('vehicle selection store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('selects numeric manufacturer, vehicle and modification in backend order', async () => {
    const store = useVehicleSelectionStore()
    await store.loadManufacturers(api)
    await store.selectManufacturer(102, api)
    await store.selectVehicle(1001, api)
    store.selectModification(9001)

    expect(store.confirmSelection()?.modification.id).toBe(9001)
    expect(store.confirmed?.displayName).toContain('Skoda')
  })

  it('clears descendants whenever an ancestor changes', async () => {
    const store = useVehicleSelectionStore()
    store.manufacturers = manufacturers
    store.vehicles = vehicles
    store.modifications = modifications
    store.manufacturerId = 102
    store.vehicleId = 1001
    store.modificationId = 9001
    store.confirmed = context

    await store.selectManufacturer(101, api)
    expect(store.vehicleId).toBeUndefined()
    expect(store.modificationId).toBeUndefined()
    expect(store.confirmed).toBeUndefined()
  })

  it('restores context with exactly one detail request and no list traversal', async () => {
    const store = useVehicleSelectionStore()
    await store.resolveFromUrl(9001, api)

    expect(api.getModificationContext).toHaveBeenCalledOnce()
    expect(api.getManufacturers).not.toHaveBeenCalled()
    expect(api.getVehicles).not.toHaveBeenCalled()
    expect(api.getModifications).not.toHaveBeenCalled()
    expect(store.status).toBe('ready')
  })

  it('clears stale context and marks a 404 restoration invalid', async () => {
    const store = useVehicleSelectionStore()
    store.confirmed = context
    await store.resolveFromUrl(9999, {
      ...api,
      getModificationContext: async () => {
        throw new AppError({ code: 'VEHICLE_NOT_FOUND', statusCode: 404 })
      }
    })
    expect(store.status).toBe('invalid')
    expect(store.confirmed).toBeUndefined()
    expect(store.manufacturerId).toBeUndefined()
  })

  it('ignores a late vehicle response for a previous manufacturer', async () => {
    const oldResponse = deferred<CatalogVehicle[]>()
    const nextResponse = deferred<CatalogVehicle[]>()
    const raceApi: VehicleDictionaryApi = {
      ...api,
      getVehicles: vi
        .fn()
        .mockReturnValueOnce(oldResponse.promise)
        .mockReturnValueOnce(nextResponse.promise)
    }
    const store = useVehicleSelectionStore()
    store.manufacturers = manufacturers

    const oldRequest = store.selectManufacturer(101, raceApi)
    const nextRequest = store.selectManufacturer(102, raceApi)
    nextResponse.resolve(vehicles)
    await nextRequest
    oldResponse.resolve([{ ...vehicles[0]!, id: 777, manufacturerId: 101 }])
    await oldRequest

    expect(store.manufacturerId).toBe(102)
    expect(store.vehicles.map((item) => item.id)).toEqual([1001])
  })

  it('preserves the valid parent and retries only the failed stage', async () => {
    const getVehicles = vi
      .fn()
      .mockRejectedValueOnce(new Error('private failure'))
      .mockResolvedValueOnce([])
    const retryApi = { ...api, getVehicles }
    const store = useVehicleSelectionStore()
    store.manufacturers = manufacturers
    await store.selectManufacturer(102, retryApi)

    expect(store.status).toBe('error')
    expect(store.manufacturerId).toBe(102)
    await store.retry(retryApi)
    expect(getVehicles).toHaveBeenCalledTimes(2)
    expect(store.status).toBe('idle')
    expect(store.vehicles).toEqual([])
  })

  it('does not mutate current data after an invalid response', async () => {
    const store = useVehicleSelectionStore()
    store.manufacturers = manufacturers
    await store.selectManufacturer(102, {
      ...api,
      getVehicles: async () => {
        throw new AppError({ code: 'VEHICLE_CATALOG_BAD_RESPONSE' })
      }
    })
    expect(store.vehicles).toEqual([])
    expect(store.manufacturerId).toBe(102)
    expect(store.failedStage).toBe('vehicles')
  })

  it('associates Russian validation with all incomplete stages', () => {
    const store = useVehicleSelectionStore()
    expect(store.confirmSelection()).toBeUndefined()
    expect(store.validationErrors).toEqual({
      manufacturer: 'Выберите производителя.',
      vehicle: 'Выберите транспортное средство.',
      modification: 'Выберите модификацию.'
    })
  })
})
