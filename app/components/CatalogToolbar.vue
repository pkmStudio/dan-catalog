<script setup lang="ts">
import type {CatalogFilters} from '~/types/catalog';

const open = ref(false);
const filters = useCatalogFilters();
const sections = [{key: 'types', label: 'Тип щетки', values: ['Бескаркасная', 'Каркасная', 'Гибридная']}, {
  key: 'sides',
  label: 'Сторона установки',
  values: ['Передняя', 'Задняя']
}, {key: 'lengths', label: 'Длина', values: [300, 400, 500, 600]}, {
  key: 'mounts',
  label: 'Тип крепления',
  values: ['Hook', 'Push Button', 'Pinch Tab']
}];
const count = computed(() => Object.values(filters.value).reduce((n, x) => n + x.length, 0));
const isChecked = (key: string, value: string | number) => (filters.value[key as keyof CatalogFilters] as (string | number)[]).includes(value);
const toggle = (key: string, value: string | number) => {
  const values = filters.value[key as keyof CatalogFilters] as (string | number)[];
  (filters.value as any)[key] = values.includes(value) ? values.filter(x => x !== value) : [...values, value]
};
const reset = () => filters.value = {types: [], sides: [], lengths: [], mounts: []}
</script>
<template>
  <button class="mobile-filter-button" @click="open=true">☷ Фильтры <em v-if="count">{{ count }}</em></button>
  <aside class="filters" :class="{open}">
    <div class="filters-title"><h3>Фильтры</h3>
      <button @click="open=false">×</button>
    </div>
    <fieldset v-for="section in sections" :key="section.key">
      <legend>{{ section.label }}</legend>
      <label v-for="value in section.values" :key="value"><input type="checkbox" :checked="isChecked(section.key,value)"
                                                                 @change="toggle(section.key,value)"><span>{{
          value
        }}{{ section.key === 'lengths' ? ' мм' : '' }}</span></label></fieldset>
    <div class="filter-actions"><span>Выбрано фильтров <b>{{ count }}</b></span>
      <button class="button" @click="open=false">Применить фильтры</button>
      <button class="button secondary" @click="reset">↻ Сбросить</button>
    </div>
  </aside>
  <button v-if="open" class="filter-backdrop" @click="open=false" aria-label="Закрыть"/>
</template>
