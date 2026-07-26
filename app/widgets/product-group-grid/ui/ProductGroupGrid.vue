<script setup lang="ts">
import { ProductGroupCard, type ProductGroup } from '~/entities/product-group'

defineProps<{ groups: ProductGroup[] }>()
</script>

<template>
  <section class="content-section" aria-labelledby="product-groups-title">
    <div class="section-heading">
      <h2 id="product-groups-title">Группы товаров</h2>
      <span>{{ groups.length }}</span>
    </div>
    <div class="groups-grid">
      <ProductGroupCard v-for="group in groups" :key="group.id" :group="group" />
    </div>
  </section>
</template>
