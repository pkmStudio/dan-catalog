import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import type { VehicleMake, VehicleModel, VehicleModification } from '~/entities/vehicle/model'
import {
  useVehicleSelectionStore,
  type VehicleDictionaryApi
} from '~/features/select-vehicle/model'

const makes: VehicleMake[] = [
  { id: 'toyota', name: 'Toyota', sortOrder: 0 },
  { id: 'nissan', name: 'Nissan', sortOrder: 1 }
]
const models: VehicleModel[] = [
  { id: 'camry', makeId: 'toyota', name: 'Camry', sortOrder: 0 },
  { id: 'rav4', makeId: 'toyota', name: 'RAV4', sortOrder: 1 }
]
const modifications: VehicleModification[] = [
  {
    id: 'toyota-camry-xv70-25',
    modelId: 'camry',
    generation: 'XV70',
    yearFrom: 2018,
    yearTo: 2023,
    engine: '2.5 бензин',
    powerHp: 181,
    displayName: 'XV70 · 2.5 бензин · 2018–2023'
  }
]

const api: VehicleDictionaryApi = {
  getMakes: async () => makes,
  getModels: async (makeId) => models.filter((model) => model.makeId === makeId),
  getModifications: async (modelId) =>
    modifications.filter((modification) => modification.modelId === modelId)
}

describe('vehicle selection store', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('clears every descendant when an ancestor changes', async () => {
    const store = useVehicleSelectionStore()
    await store.loadMakes(api)
    await store.selectMake('toyota', api)
    await store.selectModel('camry', api)
    store.selectModification('toyota-camry-xv70-25')
    expect(store.confirmSelection()?.modification.id).toBe('toyota-camry-xv70-25')

    await store.selectMake('nissan', api)
    expect(store.modelId).toBe('')
    expect(store.modificationId).toBe('')
    expect(store.modifications).toEqual([])
    expect(store.confirmed).toBeUndefined()
  })

  it('clears modification when the model changes', async () => {
    const store = useVehicleSelectionStore()
    await store.loadMakes(api)
    await store.selectMake('toyota', api)
    await store.selectModel('camry', api)
    store.selectModification('toyota-camry-xv70-25')

    await store.selectModel('rav4', api)
    expect(store.modificationId).toBe('')
    expect(store.confirmed).toBeUndefined()
  })

  it('restores a confirmed vehicle context from a URL modification id', async () => {
    const store = useVehicleSelectionStore()
    const context = await store.resolveFromUrl('toyota-camry-xv70-25', api)

    expect(store.status).toBe('ready')
    expect(context?.displayName).toContain('Toyota Camry')
    expect(store.makeId).toBe('toyota')
    expect(store.modelId).toBe('camry')
    expect(store.modificationId).toBe('toyota-camry-xv70-25')
  })

  it('marks an unknown URL modification invalid and never reuses stale labels', async () => {
    const store = useVehicleSelectionStore()
    await store.resolveFromUrl('toyota-camry-xv70-25', api)
    const context = await store.resolveFromUrl('missing', api)

    expect(context).toBeUndefined()
    expect(store.status).toBe('invalid')
    expect(store.confirmed).toBeUndefined()
    expect(store.makeId).toBe('')
  })

  it('associates Russian validation with every missing selection', () => {
    const store = useVehicleSelectionStore()

    expect(store.confirmSelection()).toBeUndefined()
    expect(store.validationErrors).toEqual({
      make: 'Выберите марку автомобиля.',
      model: 'Выберите модель автомобиля.',
      modification: 'Выберите модификацию автомобиля.'
    })
  })

  it('preserves staged selection and enters a recoverable error state', async () => {
    const store = useVehicleSelectionStore()
    store.makes = makes
    await store.selectMake('toyota', {
      ...api,
      getModels: async () => {
        throw new Error('network')
      }
    })

    expect(store.makeId).toBe('toyota')
    expect(store.status).toBe('error')
    expect(store.errorMessage).toBeTruthy()
    expect(store.failedStage).toBe('models')
  })
})
