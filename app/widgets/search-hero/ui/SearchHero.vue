<script setup lang="ts">
import { ProductSearch, useProductSearchStore } from '~/features/product-search'

const route = useRoute()
const store = useProductSearchStore()

watch(
  () => route.query.q,
  async (value) => {
    const routeQuery = typeof value === 'string' ? value.trim() : ''
    if (!routeQuery) return

    store.query = routeQuery
    store.activateSurface('hero')
    if (
      store.lastSearchQuery === routeQuery &&
      (store.status === 'success' || store.status === 'empty')
    ) {
      return
    }

    await store.submitSearch('hero')
  },
  { immediate: true }
)
</script>

<template>
  <div class="search-hero">
    <ProductSearch hero surface="hero" />
  </div>
</template>

<style scoped>
.search-hero {
  inline-size: min(100%, 640px);
}
</style>
