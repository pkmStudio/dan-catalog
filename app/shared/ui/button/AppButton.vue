<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary'
    disabled?: boolean
    loading?: boolean
  }>(),
  {
    type: 'button',
    variant: 'primary',
    disabled: false,
    loading: false
  }
)
</script>

<template>
  <button
    :type="type"
    class="app-button"
    :class="{
      'app-button--primary': variant === 'primary',
      'app-button--secondary': variant === 'secondary'
    }"
    :disabled="disabled || loading"
    :aria-busy="loading"
  >
    <span v-if="loading" class="app-button__spinner" aria-hidden="true" />
    <span
      ><slot>{{ loading ? 'Подождите…' : 'Продолжить' }}</slot></span
    >
  </button>
</template>

<style scoped>
.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  min-block-size: 44px;
  padding: var(--spacing-sm) var(--spacing-lg);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font: inherit;
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
}

.app-button--primary {
  background: var(--brand-orange);
  color: var(--text-inverse);
}

.app-button--secondary {
  border-color: var(--border-medium);
  background: var(--bg-primary);
  color: var(--text-primary);
}

.app-button:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

.app-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.app-button__spinner {
  inline-size: 16px;
  block-size: 16px;
  border: 2px solid currentColor;
  border-inline-end-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(1turn);
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-button__spinner {
    animation: none;
  }
}
</style>
