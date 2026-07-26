<script setup lang="ts">
import type { ProductAnalog } from '../model'

defineProps<{ items: ProductAnalog[] }>()
</script>

<template>
  <ul v-if="items.length" class="detail-list">
    <li v-for="item in items" :key="item.id">
      <NuxtLink v-if="item.productId" :to="`/product/${item.productId}`">
        <b>{{ item.name }}</b>
        <span>{{ item.sku }}</span>
      </NuxtLink>
      <span v-else>
        <b>{{ item.name }}</b>
        <small>{{ item.sku }}</small>
      </span>
    </li>
  </ul>
  <p v-else>Аналоги для этого товара не указаны.</p>
</template>

<style scoped>
.detail-list {
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--spacing-sm);
  list-style: none;
}
.detail-list a,
.detail-list li > span {
  padding: var(--spacing-sm);
  border-radius: var(--radius-sm);
  background: var(--bg-primary);
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-md);
}
.detail-list a {
  color: var(--text-primary);
}
</style>
