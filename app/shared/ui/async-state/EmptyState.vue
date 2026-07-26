<script setup lang="ts">
const titleId = useId()

withDefaults(
  defineProps<{
    title?: string
    description?: string
  }>(),
  {
    title: 'Ничего не найдено',
    description: 'Попробуйте изменить параметры или вернуться позже.'
  }
)
</script>

<template>
  <section class="async-state" :aria-labelledby="titleId">
    <h2 :id="titleId">{{ title }}</h2>
    <p>{{ description }}</p>
    <slot />
  </section>
</template>

<style scoped>
.async-state {
  padding: var(--spacing-xl);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  background: var(--bg-secondary);
  text-align: center;
}

.async-state h2 {
  margin: 0 0 var(--spacing-sm);
  font-size: var(--font-size-lg);
}

.async-state p {
  margin: 0 0 var(--spacing-md);
  color: var(--text-secondary);
}
</style>
