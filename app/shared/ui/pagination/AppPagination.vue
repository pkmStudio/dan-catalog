<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue'

const props = defineProps<{
  page: number
  pageCount: number
  label?: string
}>()

const emit = defineEmits<{
  'update:page': [page: number]
}>()

const pages = computed(() =>
  Array.from({ length: Math.max(0, props.pageCount) }, (_, index) => index + 1)
)

const selectPage = (page: number) => {
  if (page < 1 || page > props.pageCount || page === props.page) return
  emit('update:page', page)
}
</script>

<template>
  <nav v-if="pageCount > 1" class="pagination" :aria-label="label || 'Страницы каталога'">
    <button
      type="button"
      aria-label="Предыдущая страница"
      :disabled="page <= 1"
      @click="selectPage(page - 1)"
    >
      <ChevronLeft :size="20" :stroke-width="2" aria-hidden="true" />
    </button>
    <button
      v-for="item in pages"
      :key="item"
      type="button"
      :aria-current="item === page ? 'page' : undefined"
      :aria-label="`Страница ${item}`"
      @click="selectPage(item)"
    >
      {{ item }}
    </button>
    <button
      type="button"
      aria-label="Следующая страница"
      :disabled="page >= pageCount"
      @click="selectPage(page + 1)"
    >
      <ChevronRight :size="20" :stroke-width="2" aria-hidden="true" />
    </button>
  </nav>
</template>

<style scoped>
.pagination {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--spacing-xs);
}

.pagination button {
  display: grid;
  place-items: center;
  min-inline-size: 44px;
  min-block-size: 44px;
  padding: var(--spacing-sm);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  color: var(--text-primary);
  font: inherit;
  cursor: pointer;
}

.pagination button[aria-current='page'] {
  border-color: var(--brand-orange);
  background: var(--brand-orange);
  color: var(--text-inverse);
}

.pagination button:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}
</style>
