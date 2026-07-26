<script setup lang="ts">
import { ImageFallback } from '~/shared/ui/image-fallback'
import type { ProductSummary } from '../model'

defineProps<{
  product: ProductSummary
  optionId: string
  active?: boolean
}>()

const emit = defineEmits<{
  select: [product: ProductSummary]
  highlight: []
}>()
</script>

<template>
  <li
    class="product-search-result"
    :class="{ 'product-search-result--active': active }"
    role="none"
  >
    <button
      :id="optionId"
      type="button"
      role="option"
      :aria-selected="active"
      @mouseenter="emit('highlight')"
      @focus="emit('highlight')"
      @click="emit('select', product)"
    >
      <ImageFallback
        class="product-search-result__image"
        :src="product.image"
        :alt="`Товар ${product.name}`"
      />
      <span class="product-search-result__content">
        <strong>{{ product.sku }}</strong>
        <span>{{ product.name }}</span>
      </span>
      <span class="product-search-result__arrow" aria-hidden="true">›</span>
      <span class="visually-hidden">Открыть товар</span>
    </button>
  </li>
</template>

<style scoped>
.product-search-result {
  list-style: none;
}

.product-search-result button {
  inline-size: 100%;
  min-block-size: 60px;
  padding: 8px 10px;
  border: 0;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: start;
  cursor: pointer;
}

.product-search-result button:hover,
.product-search-result--active button {
  background: var(--bg-brand-subtle);
}

.product-search-result button:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

.product-search-result__image {
  inline-size: 44px;
  block-size: 44px;
  min-block-size: 44px;
  padding: 2px;
  border-radius: 6px;
  object-fit: cover;
  flex: none;
}

.product-search-result__content {
  min-inline-size: 0;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
}

.product-search-result__content strong {
  color: var(--brand-orange);
  font-size: 12px;
  font-weight: var(--font-weight-semibold);
}

.product-search-result__content span {
  overflow: hidden;
  color: var(--text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-search-result__arrow {
  color: var(--text-muted);
  font-size: 20px;
  line-height: 1;
}

:deep(.product-search-result__image span) {
  font-size: 11px;
}

:deep(.product-search-result__image small) {
  display: none;
}

@media (max-width: 700px) {
  .product-search-result button {
    min-block-size: 54px;
    padding: 6px 8px;
    gap: 10px;
  }

  .product-search-result__image {
    inline-size: 38px;
    block-size: 38px;
    min-block-size: 38px;
    border-radius: 5px;
  }

  .product-search-result__content strong {
    font-size: 11px;
  }

  .product-search-result__content span {
    font-size: 13px;
  }
}
</style>
