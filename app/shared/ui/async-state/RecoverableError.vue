<script setup lang="ts">
const titleId = useId()

withDefaults(
  defineProps<{
    title?: string
    message?: string
    retryLabel?: string
  }>(),
  {
    title: 'Не удалось загрузить данные',
    message: 'Проверьте подключение и попробуйте ещё раз.',
    retryLabel: 'Повторить'
  }
)

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <section class="async-state" role="alert" :aria-labelledby="titleId">
    <h2 :id="titleId">{{ title }}</h2>
    <p>{{ message }}</p>
    <button type="button" @click="emit('retry')">{{ retryLabel }}</button>
  </section>
</template>

<style scoped>
.async-state {
  padding: var(--spacing-xl);
  border: 1px solid var(--error);
  border-radius: var(--radius-lg);
  background: var(--bg-primary);
  text-align: center;
}

.async-state h2 {
  margin: 0 0 var(--spacing-sm);
  color: var(--error);
  font-size: var(--font-size-lg);
}

.async-state p {
  margin: 0 0 var(--spacing-md);
  color: var(--text-secondary);
}

.async-state button {
  min-block-size: 44px;
  padding: var(--spacing-sm) var(--spacing-lg);
  border: 0;
  border-radius: var(--radius-md);
  background: var(--brand-orange);
  color: var(--text-inverse);
  font: inherit;
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
}

.async-state button:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}
</style>
