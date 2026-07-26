<script setup lang="ts">
import type { ProductGroup } from '~/types/catalog'

defineProps<{ group: ProductGroup }>()
</script>
<template>
  <NuxtLink class="group-card" :to="group.id === 'wipers' ? '/category/wipers' : '/category/wipers'"
    ><span class="group-icon"><AppIcon :name="group.icon" /></span><b>{{ group.name }}</b
    ><i>›</i></NuxtLink
  >
</template>
