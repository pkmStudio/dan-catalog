import { mountSuspended } from '@nuxt/test-utils/runtime'
import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'
import { CategoryGrid } from '~/widgets/category-grid'
import { ProductDetails } from '~/widgets/product-details'
import type { Product } from '~/entities/product'
import { useCatalogStateStore } from '~/features/filter-products'
import { RecoverableError } from '~/shared/ui/async-state'

const product: Product = {
  id: 'lw-600',
  sku: 'LW-600',
  name: 'Щётка DAN 600 мм',
  image: '/images/lw-600.png',
  categoryId: 'wipers',
  description: 'Демонстрационное описание товара.',
  images: [
    { src: '/images/lw-600.png', alt: 'Главное изображение', sortOrder: 0 },
    { src: '/images/lw-600-side.png', alt: 'Вид сбоку', sortOrder: 1 }
  ],
  specifications: [{ key: 'length', label: 'Длина', value: 600, unit: 'мм', filterable: true }],
  oemNumbers: ['85212-0R040'],
  analogs: [
    {
      id: 'analog-1',
      sku: 'DAN-WB-002',
      name: 'Щётка DAN 500 мм',
      productId: 'dan-wb-002'
    }
  ],
  applications: [{ modificationId: 'camry', label: 'Toyota Camry XV70' }],
  seo: {
    title: 'Щётка DAN 600 мм',
    description: 'Описание',
    canonicalPath: '/product/lw-600'
  }
}

describe('catalog journey', () => {
  it('links a category to its product route', async () => {
    const wrapper = await mountSuspended(CategoryGrid, {
      props: {
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

    expect(wrapper.get('a').attributes('href')).toBe('/category/wipers')
  })

  it('renders an actionable empty category state', async () => {
    const wrapper = await mountSuspended(CategoryGrid, { props: { categories: [] } })

    expect(wrapper.text()).toContain('В группе пока нет категорий')
    expect(wrapper.get('a').attributes('href')).toBe('/catalog')
  })

  it('offers a retry action for recoverable catalog errors', async () => {
    const retry = vi.fn()
    const wrapper = await mountSuspended(RecoverableError, {
      props: { message: 'Не удалось загрузить каталог.' },
      attrs: { onRetry: retry }
    })

    await wrapper.get('button').trigger('click')
    expect(retry).toHaveBeenCalledOnce()
  })

  it('restores prior filter and page states like browser back/forward navigation', () => {
    setActivePinia(createPinia())
    const store = useCatalogStateStore()

    store.restore('wipers', { filter: 'type:Каркасная', page: '2' })
    expect(store.serializedQuery).toEqual({ filter: ['type:Каркасная'], page: '2' })
    store.restore('wipers', { filter: 'side:Задняя' })
    expect(store.serializedQuery).toEqual({ filter: ['side:Задняя'] })
    store.restore('wipers', { filter: 'type:Каркасная', page: '2' })
    expect(store.serializedQuery).toEqual({ filter: ['type:Каркасная'], page: '2' })
  })

  it('switches product tabs and exposes linked analog navigation', async () => {
    const wrapper = await mountSuspended(ProductDetails, { props: { product } })
    const tabs = wrapper.findAll('[role="tab"]')

    await tabs[1]?.trigger('click')
    expect(wrapper.text()).toContain('85212-0R040')
    await tabs[2]?.trigger('click')
    expect(wrapper.get('a[href="/product/dan-wb-002"]').attributes('href')).toBe(
      '/product/dan-wb-002'
    )
  })
})
