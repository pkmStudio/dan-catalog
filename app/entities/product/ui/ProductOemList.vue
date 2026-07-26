<script setup lang="ts">
defineProps<{ items: string[] }>()
</script>

<template>
  <ul v-if="items.length" class="detail-list">
    <li v-for="item in items" :key="item">{{ item }}</li>
  </ul>
  <p v-else>OEM-номера для этого товара не указаны.</p>
</template>

<style scoped>
.detail-list {
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--spacing-sm);
  list-style: none;
}
.detail-list li {
  padding: var(--spacing-sm);
  border-radius: var(--radius-sm);
  background: var(--bg-primary);
}
</style>
