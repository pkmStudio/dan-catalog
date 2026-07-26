<script setup lang="ts">
import type { FilterFacet } from '~/entities/category'
import { useCatalogStateStore } from '../model'

defineProps<{ facets: FilterFacet[] }>()
const emit = defineEmits<{ change: [] }>()
const store = useCatalogStateStore()

const toggle = (key: string, value: string) => {
  store.toggleFilter(key, value)
  emit('change')
}

const reset = () => {
  store.resetFilters()
  emit('change')
}
</script>

<template>
  <aside class="filters" aria-label="Фильтры товаров">
    <div class="filters-title">
      <h2>Фильтры</h2>
    </div>
    <fieldset v-for="facet in facets" :key="facet.key">
      <legend>{{ facet.label }}</legend>
      <label v-for="option in facet.options" :key="option.value">
        <input
          type="checkbox"
          :checked="store.filters[facet.key]?.includes(option.value)"
          @change="toggle(facet.key, option.value)"
        />
        <span>{{ option.label }} ({{ option.count }})</span>
      </label>
    </fieldset>
    <div v-if="store.activeFilterCount" class="filter-actions">
      <button type="button" class="button secondary" @click="reset">Сбросить все</button>
    </div>
  </aside>
</template>
