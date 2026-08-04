import { mountSuspended } from '@nuxt/test-utils/runtime'
import { createPinia } from 'pinia'
import { describe, expect, it } from 'vitest'
import type { CompatibilityResult } from '~/entities/compatibility'
import { CompatibilityStatus } from '~/entities/compatibility'
import type { VehicleMake, VehicleModel, VehicleModification } from '~/entities/vehicle'
import { VehicleSelector, useVehicleSelectionStore } from '~/features/select-vehicle'
import { ProductCompatibility } from '~/features/check-compatibility'
import { VehicleCategoryGrid } from '~/widgets/vehicle-category-grid'

const make: VehicleMake = { id: 'toyota', name: 'Toyota', sortOrder: 0 }
const model: VehicleModel = {
  id: 'camry',
  makeId: 'toyota',
  name: 'Camry',
  sortOrder: 0
}
const modification: VehicleModification = {
  id: 'toyota-camry-xv70-25',
  modelId: 'camry',
  generation: 'XV70',
  yearFrom: 2018,
  yearTo: 2023,
  engine: '2.5 бензин',
  displayName: 'XV70 · 2.5 бензин · 2018–2023'
}

describe('vehicle journey', () => {
  it('loads the applicable-category schema without a public API import cycle', async () => {
    const { categoryListResponseSchema } = await import('~/entities/category/model/category.schema')

    expect(categoryListResponseSchema.parse({ data: [] })).toEqual({ data: [] })
  })

  it('confirms the ordered selection and preserves its stable modification id', async () => {
    const pinia = createPinia()
    const store = useVehicleSelectionStore(pinia)
    store.makes = [make]
    store.models = [model]
    store.modifications = [modification]
    store.makeId = make.id
    store.modelId = model.id
    store.modificationId = modification.id

    const wrapper = await mountSuspended(VehicleSelector, {
      global: { plugins: [pinia] }
    })
    await wrapper.get('form').trigger('submit')

    expect(store.confirmed?.displayName).toContain('Toyota Camry')
    expect(wrapper.emitted('confirmed')?.[0]?.[0]).toMatchObject({
      modification: { id: 'toyota-camry-xv70-25' }
    })
  })

  it('keeps vehicle context in applicable category navigation', async () => {
    const wrapper = await mountSuspended(VehicleCategoryGrid, {
      props: {
        modificationId: modification.id,
        categories: [
          {
            id: 'wipers',
            groupId: 'wipers',
            slug: 'wipers',
            name: 'Щётки',
            description: '',
            image: '/images/wipers.png',
            productCount: 48
          }
        ]
      }
    })

    expect(wrapper.get('a').attributes('href')).toBe(
      '/category/wipers?vehicleModificationId=toyota-camry-xv70-25'
    )
  })

  it.each([
    ['compatible', 'Совместим'],
    ['incompatible', 'Не совместим'],
    ['unknown', 'Недостаточно данных']
  ] as const)('renders the %s compatibility state accessibly', async (status, label) => {
    const result: CompatibilityResult = {
      productId: 'lw-600',
      modificationId: modification.id,
      status,
      message: 'Проверка завершена.',
      applications: []
    }
    const wrapper = await mountSuspended(CompatibilityStatus, {
      props: { result, vehicleName: 'Toyota Camry XV70' }
    })

    expect(wrapper.text()).toContain(label)
    expect(wrapper.get('[role="status"]').attributes('aria-label')).toContain(label)
  })

  it('offers vehicle selection instead of guessing compatibility without URL context', async () => {
    const wrapper = await mountSuspended(ProductCompatibility, {
      props: { productId: 'lw-600' }
    })

    expect(wrapper.text()).toContain('Проверьте совместимость')
    expect(wrapper.get('a').attributes('href')).toBe('/vehicle')
  })
})
