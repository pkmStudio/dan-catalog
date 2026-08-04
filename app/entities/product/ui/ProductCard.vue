<script setup lang="ts">
import type { ProductSummary } from '../model'
import { ImageFallback } from '~/shared/ui/image-fallback'

defineProps<{
  product: ProductSummary
  vehicleModificationId?: string
}>()
</script>

<template>
  <NuxtLink
    class="product-card"
    :to="{
      path: `/product/${product.id}`,
      query: vehicleModificationId ? { vehicleModificationId } : {}
    }"
  >
    <ImageFallback :src="product.image" :alt="product.name" />
    <div>
      <small>Артикул: {{ product.sku }}</small>
      <h3>{{ product.name }}</h3>
      <span>Подробнее →</span>
    </div>
  </NuxtLink>
</template>
