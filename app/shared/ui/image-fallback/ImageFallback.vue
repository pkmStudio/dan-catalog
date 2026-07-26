<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    src?: string
    alt: string
    fallbackLabel?: string
    loading?: 'eager' | 'lazy'
  }>(),
  {
    src: undefined,
    fallbackLabel: 'Изображение пока недоступно',
    loading: 'lazy'
  }
)

const failed = ref(!props.src)

watch(
  () => props.src,
  (src) => {
    failed.value = !src
  }
)
</script>

<template>
  <img v-if="src && !failed" :src="src" :alt="alt" :loading="loading" @error="failed = true" />
  <div v-else class="image-fallback" role="img" :aria-label="alt || fallbackLabel">
    <span aria-hidden="true">DAN</span>
    <small>{{ fallbackLabel }}</small>
  </div>
</template>

<style scoped>
.image-fallback {
  display: grid;
  place-content: center;
  gap: var(--spacing-xs);
  inline-size: 100%;
  min-block-size: 160px;
  border: 1px solid var(--border-light);
  border-radius: inherit;
  background: var(--bg-secondary);
  color: var(--text-muted);
  text-align: center;
}

.image-fallback span {
  color: var(--brand-orange);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
}
</style>
