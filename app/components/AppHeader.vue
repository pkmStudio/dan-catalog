<script setup lang="ts">
defineProps<{ active?: 'catalog' | 'vehicle' }>()
const query = ref('')
const submit = () => navigateTo(`/category/wipers?q=${encodeURIComponent(query.value)}`)
</script>

<template>
  <header class="site-header">
    <div class="header-inner">
      <BrandLogo />
      <form class="header-search" @submit.prevent="submit">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
        <input v-model="query" aria-label="Поиск" placeholder="Поиск по артикулу, OEM, названию...">
      </form>
      <nav class="main-nav" aria-label="Основная навигация">
        <NuxtLink to="/category/wipers" :class="{active: active === 'catalog'}">Каталог</NuxtLink>
        <NuxtLink to="/vehicle" :class="{active: active === 'vehicle'}">Подбор по авто</NuxtLink>
        <a href="#about">О компании</a>
        <a href="#contacts">Контакты</a>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header{background:#fff}.header-inner{height:80px;padding:16px 48px;display:flex;align-items:center;gap:32px;max-width:1440px;margin:auto}.header-search{order:2;margin-left:auto;width:400px;height:44px;display:flex;align-items:center;gap:10px;padding:0 16px;background:var(--surface);border-radius:8px}.header-search svg{width:18px;height:18px;fill:none;stroke:var(--muted);stroke-width:2}.header-search input{width:100%;border:0;outline:0;background:transparent;font:inherit;font-size:14px}.main-nav{order:1;display:flex;gap:24px;align-items:center}.main-nav a{font-size:14px;font-weight:500}.main-nav a:hover,.main-nav .active{color:var(--orange)}
@media(max-width:900px){.header-inner{height:auto;padding:14px 20px;flex-wrap:wrap}.main-nav{order:3;width:100%;overflow:auto;gap:20px}.header-search{width:min(400px,calc(100% - 115px))}}
@media(max-width:560px){.header-search{order:1;width:100%;margin:0}.main-nav{order:2}.header-inner{gap:12px}}
</style>
