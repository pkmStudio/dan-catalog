<script setup lang="ts">
import FieldError from './FieldError.vue'

const props = defineProps<{
  id: string
  label: string
  hint?: string
  error?: string
  required?: boolean
}>()

const describedBy = computed(() =>
  [props.hint ? `${props.id}-hint` : undefined, props.error ? `${props.id}-error` : undefined]
    .filter(Boolean)
    .join(' ')
)
</script>

<template>
  <div class="form-field" :class="{ 'form-field--invalid': error }">
    <label :for="id">
      {{ label }}
      <span v-if="required" aria-hidden="true">*</span>
    </label>
    <slot :id="id" :invalid="Boolean(error)" :described-by="describedBy || undefined" />
    <p v-if="hint" :id="`${id}-hint`" class="form-field__hint">{{ hint }}</p>
    <FieldError v-if="error" :id="`${id}-error`" :message="error" />
  </div>
</template>

<style scoped>
.form-field {
  display: grid;
  gap: var(--spacing-sm);
}

.form-field label {
  color: var(--text-primary);
  font-weight: var(--font-weight-semibold);
}

.form-field label span {
  color: var(--error);
}

.form-field__hint {
  margin: 0;
  color: var(--text-muted);
  font-size: var(--font-size-sm);
}
</style>
