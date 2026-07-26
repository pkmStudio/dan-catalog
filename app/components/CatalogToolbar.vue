<script setup lang="ts">
import type { CatalogFilters } from '~/types/catalog'

type FilterKey = keyof CatalogFilters

interface StringFilterSection {
  key: Exclude<FilterKey, 'lengths'>
  label: string
  values: string[]
}

interface NumberFilterSection {
  key: 'lengths'
  label: string
  values: number[]
}

const open = ref(false)
const filters = useCatalogFilters()
const sections: Array<StringFilterSection | NumberFilterSection> = [
  { key: 'types', label: 'Тип щетки', values: ['Бескаркасная', 'Каркасная', 'Гибридная'] },
  {
    key: 'sides',
    label: 'Сторона установки',
    values: ['Передняя', 'Задняя']
  },
  { key: 'lengths', label: 'Длина', values: [300, 400, 500, 600] },
  {
    key: 'mounts',
    label: 'Тип крепления',
    values: ['Hook', 'Push Button', 'Pinch Tab']
  }
]
const count = computed(() => Object.values(filters.value).reduce((n, x) => n + x.length, 0))

const toggleListValue = <T extends string | number>(values: T[], value: T): T[] =>
  values.includes(value) ? values.filter((item) => item !== value) : [...values, value]

const isChecked = (key: FilterKey, value: string | number) => {
  if (key === 'lengths') {
    return typeof value === 'number' && filters.value.lengths.includes(value)
  }

  return typeof value === 'string' && filters.value[key].includes(value)
}

const toggle = (key: FilterKey, value: string | number) => {
  if (key === 'lengths' && typeof value === 'number') {
    filters.value.lengths = toggleListValue(filters.value.lengths, value)
    return
  }

  if (typeof value !== 'string') {
    return
  }

  switch (key) {
    case 'types':
      filters.value.types = toggleListValue(filters.value.types, value)
      break
    case 'sides':
      filters.value.sides = toggleListValue(filters.value.sides, value)
      break
    case 'mounts':
      filters.value.mounts = toggleListValue(filters.value.mounts, value)
      break
  }
}

const reset = () => (filters.value = { types: [], sides: [], lengths: [], mounts: [] })
</script>
<template>
  <button class="mobile-filter-button" @click="open = true">
    ☷ Фильтры <em v-if="count">{{ count }}</em>
  </button>
  <aside class="filters" :class="{ open }">
    <div class="filters-title">
      <h3>Фильтры</h3>
      <button @click="open = false">×</button>
    </div>
    <fieldset v-for="section in sections" :key="section.key">
      <legend>{{ section.label }}</legend>
      <label v-for="value in section.values" :key="value"
        ><input
          type="checkbox"
          :checked="isChecked(section.key, value)"
          @change="toggle(section.key, value)"
        /><span>{{ value }}{{ section.key === 'lengths' ? ' мм' : '' }}</span></label
      >
    </fieldset>
    <div class="filter-actions">
      <span
        >Выбрано фильтров <b>{{ count }}</b></span
      >
      <button class="button" @click="open = false">Применить фильтры</button>
      <button class="button secondary" @click="reset">↻ Сбросить</button>
    </div>
  </aside>
  <button v-if="open" class="filter-backdrop" aria-label="Закрыть" @click="open = false" />
</template>
