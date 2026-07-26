<script setup lang="ts">
import type { ProductGroup } from '../model'

defineProps<{ group: ProductGroup }>()
</script>

<template>
  <NuxtLink class="group-card" :to="`/catalog/${group.id}`">
    <span class="group-icon">
      <AppIcon :name="group.icon" />
    </span>
    <span class="group-card__content">
      <b>{{ group.name }}</b>
      <small>{{ group.categoryCount }} категорий</small>
    </span>
    <i aria-hidden="true">›</i>
  </NuxtLink>
</template>
