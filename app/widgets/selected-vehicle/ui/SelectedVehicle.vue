<script setup lang="ts">
import type { VehicleContext } from '~/entities/vehicle'

defineProps<{
  context: VehicleContext
  changeTo?: string
}>()
</script>

<template>
  <aside class="selected-vehicle" aria-label="Выбранный автомобиль">
    <span>
      <b>Выбранный автомобиль</b>
      <small>{{ context.displayName }}</small>
    </span>
    <NuxtLink :to="changeTo || '/vehicle'">Изменить</NuxtLink>
  </aside>
</template>
