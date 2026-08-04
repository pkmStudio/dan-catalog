<script setup lang="ts">
import type { ProductPage } from '~/entities/product'
import { ProductCard } from '~/entities/product'
import { ActiveFilterChips, ProductFilters, useCatalogStateStore } from '~/features/filter-products'
import { EmptyState } from '~/shared/ui/async-state'
import { AppPagination } from '~/shared/ui/pagination'

defineProps<{ result: ProductPage }>()
const emit = defineEmits<{ navigate: [] }>()
const store = useCatalogStateStore()

const setPage = (page: number) => {
  store.setPage(page)
  emit('navigate')
}

const reset = () => {
  store.resetFilters()
  emit('navigate')
}
</script>

<template>
  <section class="catalog-layout">
    <ProductFilters :facets="result.facets" @change="emit('navigate')" />
    <div class="products-area">
      <div class="section-heading">
        <h2>Товары категории</h2>
        <span>Найдено: {{ result.total }} товаров</span>
      </div>
      <ActiveFilterChips :facets="result.facets" @change="emit('navigate')" />
      <template v-if="result.items.length">
        <div class="products-grid">
          <ProductCard
            v-for="product in result.items"
            :key="product.id"
            :product="product"
            :vehicle-modification-id="store.vehicleModificationId"
          />
        </div>
        <AppPagination :page="result.page" :page-count="result.pageCount" @update:page="setPage" />
      </template>
      <EmptyState
        v-else
        title="В категории пока нет товаров"
        description="Сбросьте фильтры или вернитесь к группам товаров."
      >
        <button v-if="store.activeFilterCount" type="button" class="button" @click="reset">
          Сбросить фильтры
        </button>
        <NuxtLink v-else class="button" to="/catalog">К группам товаров</NuxtLink>
      </EmptyState>
    </div>
  </section>
</template>
