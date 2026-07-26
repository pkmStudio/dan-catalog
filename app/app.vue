<script setup lang="ts">const route = useRoute();
const active = computed(() => route.path.startsWith('/category') || route.path.startsWith('/catalog') || route.path.startsWith('/product') ? 'catalog' : route.path.startsWith('/vehicle') ? 'vehicle' : route.path.startsWith('/about') ? 'about' : route.path.startsWith('/contacts') ? 'contacts' : undefined)</script>
<template>
  <NuxtRouteAnnouncer/>
  <div class="page">
    <AppHeader :active="active"/>
    <NuxtPage/>
    <AppFooter/>
  </div>
</template>
