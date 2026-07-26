<script setup lang="ts">
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
    <button type="button" :disabled="page <= 1" @click="selectPage(page - 1)">
      <span aria-hidden="true">←</span>
      <span class="pagination__desktop-label">Назад</span>
      <span class="sr-only">Предыдущая страница</span>
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
    <button type="button" :disabled="page >= pageCount" @click="selectPage(page + 1)">
      <span class="pagination__desktop-label">Вперёд</span>
      <span aria-hidden="true">→</span>
      <span class="sr-only">Следующая страница</span>
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

.sr-only {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 520px) {
  .pagination__desktop-label {
    display: none;
  }
}
</style>
