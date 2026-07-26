<script setup lang="ts">
import type { FilterFacet } from '~/entities/category'
import { useCatalogStateStore } from '../model'

const props = defineProps<{ facets: FilterFacet[] }>()
const emit = defineEmits<{ change: [] }>()
const store = useCatalogStateStore()

const labelFor = (key: string, value: string): string =>
  props.facets.find((facet) => facet.key === key)?.options.find((option) => option.value === value)
    ?.label ?? value

const remove = (key: string, value: string) => {
  store.removeFilter(key, value)
  emit('change')
}

const reset = () => {
  store.resetFilters()
  emit('change')
}
</script>

<template>
  <div v-if="store.activeFilterCount" class="chips" aria-label="Применённые фильтры">
    <span>Применено:</span>
    <template v-for="[key, values] in Object.entries(store.filters)" :key="key">
      <button
        v-for="value in values"
        :key="`${key}:${value}`"
        type="button"
        class="chip"
        :aria-label="`Удалить фильтр ${labelFor(key, value)}`"
        @click="remove(key, value)"
      >
        {{ labelFor(key, value) }}
        <span aria-hidden="true">×</span>
      </button>
    </template>
    <button type="button" @click="reset">Сбросить все</button>
  </div>
</template>
