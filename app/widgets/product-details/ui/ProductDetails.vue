<script setup lang="ts">
import {
  ProductAnalogList,
  ProductGallery,
  ProductOemList,
  ProductSpecifications,
  type Product
} from '~/entities/product'

defineProps<{ product: Product }>()
const tab = ref<'oem' | 'analogs'>('oem')
</script>

<template>
  <section class="product-detail">
    <ProductGallery :images="product.images" :product-name="product.name" />
    <article class="product-info">
      <div class="sku">
        Артикул: <b>{{ product.sku }}</b>
      </div>
      <h1>{{ product.name }}</h1>
      <p class="description">{{ product.description }}</p>
      <slot name="compatibility" />
      <ProductSpecifications :specifications="product.specifications" />
      <section class="tabs">
        <div class="tab-buttons" role="tablist" aria-label="Информация о товаре">
          <button
            type="button"
            role="tab"
            :aria-selected="tab === 'oem'"
            :class="{ active: tab === 'oem' }"
            @click="tab = 'oem'"
          >
            OEM номера
          </button>
          <button
            type="button"
            role="tab"
            :aria-selected="tab === 'analogs'"
            :class="{ active: tab === 'analogs' }"
            @click="tab = 'analogs'"
          >
            Аналоги
          </button>
        </div>
        <div class="tab-content" role="tabpanel">
          <ProductOemList v-if="tab === 'oem'" :items="product.oemNumbers" />
          <ProductAnalogList v-else :items="product.analogs" />
        </div>
      </section>
      <NuxtLink class="button" :to="`/product/${product.id}/question`">
        Задать вопрос о товаре
      </NuxtLink>
    </article>
  </section>
</template>
