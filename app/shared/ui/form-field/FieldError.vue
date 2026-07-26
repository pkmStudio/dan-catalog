<script setup lang="ts">
defineProps<{
  id?: string
  message: string
}>()
</script>

<template>
  <p :id="id" class="field-error" role="alert">{{ message }}</p>
</template>

<style scoped>
.field-error {
  margin: 0;
  color: var(--error);
  font-size: var(--font-size-sm);
}
</style>
