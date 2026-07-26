<script setup lang="ts">
import { AppFooter } from '~/widgets/app-footer'
import { AppHeader } from '~/widgets/app-header'

type ActiveSection = 'catalog' | 'vehicle' | 'about' | 'contacts'

const route = useRoute()

const activeSection = computed<ActiveSection | undefined>(() => {
  if (
    route.path.startsWith('/category') ||
    route.path.startsWith('/catalog') ||
    route.path.startsWith('/product')
  ) {
    return 'catalog'
  }

  if (route.path.startsWith('/vehicle')) {
    return 'vehicle'
  }

  if (route.path.startsWith('/about')) {
    return 'about'
  }

  if (route.path.startsWith('/contacts')) {
    return 'contacts'
  }

  return undefined
})
</script>

<template>
  <div class="page">
    <AppHeader :active="activeSection" />
    <slot />
    <AppFooter />
  </div>
</template>
