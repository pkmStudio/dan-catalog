<script setup lang="ts">
defineProps<{ error?: string }>()
defineEmits<{ retry: [] }>()
</script>
<template>
  <div class="state-card">
    <template v-if="error"
      ><b>⚠ Не удалось загрузить данные</b>
      <p>{{ error }}</p>
      <button class="button" @click="$emit('retry')">Повторить</button>
    </template>
    <template v-else><span class="spinner" /><b>Загружаем данные…</b></template>
  </div>
</template>
