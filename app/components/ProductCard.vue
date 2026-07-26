<script setup lang="ts">
import type { Product } from '~/types/catalog'

defineProps<{ product: Product }>()
</script>
<template>
  <NuxtLink class="product-card" :to="`/product/${product.id}`"
    ><img :src="product.image" :alt="product.name" />
    <div>
      <small>{{ product.sku }}</small>
      <h3>{{ product.name }}</h3>
      <span>Подробнее →</span>
    </div>
  </NuxtLink>
</template>
