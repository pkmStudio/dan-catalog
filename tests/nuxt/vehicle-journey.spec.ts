import { mountSuspended } from '@nuxt/test-utils/runtime'
import { createPinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'
import {
  createVehicleContext,
  type CatalogVehicle,
  type VehicleManufacturer,
  type VehicleModification
} from '~/entities/vehicle'
import {
  VehicleSelector,
  useVehicleSelectionStore,
  type VehicleDictionaryApi
} from '~/features/select-vehicle'
import { SelectedVehicle } from '~/widgets/selected-vehicle'

const manufacturer: VehicleManufacturer = { id: 102, mfaId: 50102, name: 'Skoda' }
const vehicle: CatalogVehicle = {
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
const modification: VehicleModification = {
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

describe('vehicle journey', () => {
  it('confirms a numeric context without promising applicable categories', async () => {
    const pinia = createPinia()
    const store = useVehicleSelectionStore(pinia)
    store.manufacturers = [manufacturer]
    store.vehicles = [vehicle]
    store.modifications = [modification]
    store.manufacturerId = manufacturer.id
    store.vehicleId = vehicle.id
    store.modificationId = modification.id

    const wrapper = await mountSuspended(VehicleSelector, { global: { plugins: [pinia] } })
    await wrapper.get('form').trigger('submit')

    expect(wrapper.emitted('confirmed')?.[0]?.[0]).toMatchObject({
      modification: { id: 9001 }
    })
    expect(wrapper.text()).not.toContain('подходящие категории')
  })

  it('shows distinct empty vehicles and modifications states in Russian', async () => {
    const pinia = createPinia()
    const store = useVehicleSelectionStore(pinia)
    store.manufacturers = [manufacturer]
    store.manufacturerId = manufacturer.id

    const wrapper = await mountSuspended(VehicleSelector, { global: { plugins: [pinia] } })
    expect(wrapper.text()).toContain('нет доступных транспортных средств')

    store.vehicles = [vehicle]
    store.vehicleId = vehicle.id
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('нет модификаций')
  })

  it('renders a safe retry action and never exposes technical details', async () => {
    const pinia = createPinia()
    const store = useVehicleSelectionStore(pinia)
    store.manufacturers = [manufacturer]
    store.status = 'error'
    store.failedStage = 'vehicles'
    store.errorMessage = 'Не удалось получить данные автомобиля. Попробуйте ещё раз.'
    const retry = vi.spyOn(store, 'retry').mockResolvedValue(undefined)

    const wrapper = await mountSuspended(VehicleSelector, { global: { plugins: [pinia] } })
    expect(wrapper.text()).not.toMatch(/X-Service-Key|https?:\/\/|secret/u)
    expect(wrapper.get('[role="alert"]').text()).toContain('Попробуйте ещё раз')
    await wrapper.get('[role="alert"] button').trigger('click')
    expect(retry).toHaveBeenCalledOnce()
  })

  it('focuses the first invalid control and associates inline validation', async () => {
    const pinia = createPinia()
    const store = useVehicleSelectionStore(pinia)
    store.manufacturers = [manufacturer]
    const wrapper = await mountSuspended(VehicleSelector, {
      attachTo: document.body,
      global: { plugins: [pinia] }
    })
    const focus = vi.spyOn(HTMLElement.prototype, 'focus')
    await wrapper.get('form').trigger('submit')
    const select = wrapper.get('#vehicle-manufacturer')
    expect(select.attributes('aria-invalid')).toBe('true')
    expect(select.attributes('aria-describedby')).toBe('vehicle-manufacturer-error')
    expect(document.activeElement?.id).toBe('vehicle-manufacturer')
    expect(focus).toHaveBeenCalled()
    focus.mockRestore()
    wrapper.unmount()
  })

  it('supports editing a confirmed context', async () => {
    const wrapper = await mountSuspended(SelectedVehicle, {
      props: { context: createVehicleContext(manufacturer, vehicle, modification) }
    })
    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('edit')).toHaveLength(1)
    expect(wrapper.text()).toContain('Skoda')
  })

  it('uses one detail operation for refresh/deep-link restoration', async () => {
    const pinia = createPinia()
    const store = useVehicleSelectionStore(pinia)
    const api: VehicleDictionaryApi = {
      getManufacturers: vi.fn(async () => []),
      getVehicles: vi.fn(async () => []),
      getModifications: vi.fn(async () => []),
      getModificationContext: vi.fn(async () =>
        createVehicleContext(manufacturer, vehicle, modification)
      )
    }
    await store.resolveFromUrl(9001, api)
    expect(api.getModificationContext).toHaveBeenCalledOnce()
    expect(api.getManufacturers).not.toHaveBeenCalled()
  })
})
