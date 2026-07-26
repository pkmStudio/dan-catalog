<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
  crumbs?: { label: string; to?: string }[]
}>()
</script>
<template>
  <section class="page-hero">
    <div class="breadcrumbs">
      <NuxtLink to="/">Главная</NuxtLink>
      <span v-for="(crumb, i) in crumbs" :key="i"
        >› <NuxtLink v-if="crumb.to" :to="crumb.to">{{ crumb.label }}</NuxtLink
        ><template v-else>{{ crumb.label }}</template></span
      >
    </div>
    <h1>{{ title }}</h1>
    <p>{{ subtitle }}</p>
  </section>
</template>
