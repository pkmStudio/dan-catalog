<script setup lang="ts">
import type { VehicleContext } from '~/entities/vehicle'

defineProps<{
  context: VehicleContext
}>()

const emit = defineEmits<{ edit: [] }>()
</script>

<template>
  <aside class="selected-vehicle" aria-label="Выбранный автомобиль">
    <span>
      <b>Выбранный автомобиль</b>
      <small>{{ context.displayName }}</small>
    </span>
    <button type="button" class="button" @click="emit('edit')">Изменить</button>
  </aside>
</template>
