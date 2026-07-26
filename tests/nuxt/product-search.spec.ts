import { mountSuspended } from '@nuxt/test-utils/runtime'
import { createPinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { ProductSearch, useProductSearchStore } from '~/features/product-search'

const product = {
  id: 'lw-600',
  sku: 'LW-600',
  name: 'Щётка стеклоочистителя DAN 600 мм',
  image: '/images/lw-600.png'
}

const mountSearch = async () => {
  const pinia = createPinia()
  const wrapper = await mountSuspended(ProductSearch, {
    props: { surface: 'test' },
    global: { plugins: [pinia] }
  })
  return { pinia, store: useProductSearchStore(pinia), wrapper }
}

describe('ProductSearch', () => {
  it('shows Russian inline validation for an empty submit', async () => {
    const { wrapper } = await mountSearch()

    await wrapper.get('form').trigger('submit')

    expect(wrapper.text()).toContain('Введите артикул или название товара.')
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
  })

  it('announces loading and exposes suggestions to keyboard navigation', async () => {
    const { store, wrapper } = await mountSearch()
    store.activateSurface('test')
    store.status = 'loading'
    await wrapper.get('input').trigger('focus')
    await nextTick()
    expect(wrapper.text()).toContain('Ищем товары…')

    store.status = 'success'
    store.match = 'multiple'
    store.results = [product]
    await nextTick()
    await wrapper.get('input').trigger('keydown', { key: 'ArrowDown' })

    expect(wrapper.get('[role="option"]').attributes('aria-selected')).toBe('true')
    expect(wrapper.get('input').attributes('aria-activedescendant')).toContain('lw-600')

    store.highlightedIndex = -1
    await wrapper.get('[role="option"]').trigger('mouseenter')
    expect(store.highlightedIndex).toBe(0)
  })

  it('renders empty and retry states without clearing the input', async () => {
    const { store, wrapper } = await mountSearch()
    store.query = 'редкий товар'
    store.activateSurface('test')
    store.status = 'empty'
    await wrapper.get('input').trigger('focus')
    await nextTick()

    expect(wrapper.text()).toContain('Ничего не найдено')
    expect(wrapper.get('input').element.value).toBe('редкий товар')

    store.status = 'error'
    store.errorMessage = 'Поиск временно недоступен.'
    const retry = vi.spyOn(store, 'retrySearch').mockResolvedValue(undefined)
    await nextTick()
    await wrapper.get('button[type="button"]').trigger('click')

    expect(retry).toHaveBeenCalledWith('test')
    expect(store.query).toBe('редкий товар')
  })
})
