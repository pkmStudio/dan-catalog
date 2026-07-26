<script setup lang="ts">
withDefaults(
  defineProps<{
    message?: string
  }>(),
  {
    message: 'Загружаем данные…'
  }
)
</script>

<template>
  <div class="async-state" role="status" aria-live="polite">
    <span class="async-state__spinner" aria-hidden="true" />
    <span>{{ message }}</span>
  </div>
</template>

<style scoped>
.async-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  min-block-size: 120px;
  color: var(--text-secondary);
}

.async-state__spinner {
  inline-size: 20px;
  block-size: 20px;
  border: 2px solid var(--border-light);
  border-block-start-color: var(--brand-orange);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(1turn);
  }
}

@media (prefers-reduced-motion: reduce) {
  .async-state__spinner {
    animation: none;
  }
}
</style>
