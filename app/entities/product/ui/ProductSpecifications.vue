<script setup lang="ts">
import type { ProductSpecification } from '../model'

defineProps<{ specifications: ProductSpecification[] }>()
</script>

<template>
  <section class="specs" aria-labelledby="product-specifications-title">
    <h2 id="product-specifications-title">Характеристики</h2>
    <dl>
      <div v-for="item in specifications" :key="item.key">
        <dt>{{ item.label }}</dt>
        <dd>
          {{ item.value }}<template v-if="item.unit"> {{ item.unit }}</template>
        </dd>
      </div>
    </dl>
  </section>
</template>

<style scoped>
dl,
dl div {
  margin: 0;
}
dl div {
  display: grid;
  grid-template-columns: minmax(140px, 180px) 1fr;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) 0;
}
dt {
  color: var(--text-muted);
}
dd {
  font-weight: var(--font-weight-semibold);
}
</style>
