<script setup lang="ts">
import type { CompatibilityResult } from '../model'

defineProps<{
  result: CompatibilityResult
  vehicleName: string
}>()

const labels = {
  compatible: 'Совместим',
  incompatible: 'Не совместим',
  unknown: 'Недостаточно данных'
} as const

const symbols = {
  compatible: '✓',
  incompatible: '×',
  unknown: '?'
} as const
</script>

<template>
  <section
    class="compatibility-status"
    :class="`compatibility-status--${result.status}`"
    role="status"
    :aria-label="`Совместимость: ${labels[result.status]}`"
  >
    <span class="compatibility-status__symbol" aria-hidden="true">
      {{ symbols[result.status] }}
    </span>
    <span>
      <strong>{{ labels[result.status] }}</strong>
      <small>{{ vehicleName }}</small>
      <small>{{ result.message }}</small>
    </span>
  </section>
</template>

<style scoped>
.compatibility-status {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-lg);
  background: var(--bg-secondary);
}

.compatibility-status > span:last-child {
  display: grid;
  gap: var(--spacing-xs);
}

.compatibility-status strong,
.compatibility-status small {
  display: block;
}

.compatibility-status small {
  color: var(--text-secondary);
}

.compatibility-status__symbol {
  display: grid;
  flex: 0 0 36px;
  inline-size: 36px;
  block-size: 36px;
  place-items: center;
  border-radius: var(--radius-pill);
  background: var(--bg-primary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
}

.compatibility-status--compatible {
  border-color: var(--success);
}

.compatibility-status--compatible .compatibility-status__symbol {
  color: var(--success);
}

.compatibility-status--incompatible {
  border-color: var(--error);
}

.compatibility-status--incompatible .compatibility-status__symbol {
  color: var(--error);
}

.compatibility-status--unknown {
  border-style: dashed;
}
</style>
