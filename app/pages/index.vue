<script setup lang="ts">
const query = ref('')
const search = () => navigateTo(`/category/wipers?q=${encodeURIComponent(query.value)}`)
</script>

<template>
  <div class="page">
    <AppHeader />
    <main>
      <section class="hero">
        <h1>Электронный каталог автозапчастей DAN</h1>
        <p>Найдите нужную запчасть по артикулу, OEM-номеру или названию</p>
        <form class="hero-search" @submit.prevent="search">
          <label>
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
            <input v-model="query" aria-label="Поиск детали" placeholder="Введите артикул или название детали...">
          </label>
          <button type="submit">Найти</button>
        </form>
      </section>
      <section class="categories container">
        <h2>Категории товаров</h2>
        <div class="category-grid">
          <NuxtLink to="/category/wipers" class="category-card">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.7 7.7A2.5 2.5 0 1 1 19.5 12H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>
            <span>Щетки стеклоочистителя</span>
          </NuxtLink>
          <div class="category-card">
            <svg viewBox="0 0 24 24"><path d="m13 2-8 12h7l-1 8 8-12h-7z"/></svg>
            <span>Свечи зажигания</span><small>Скоро</small>
          </div>
        </div>
      </section>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.hero{padding:80px 48px;background:var(--surface);display:flex;flex-direction:column;align-items:center;gap:28px;text-align:center}.hero h1{margin:0;font-size:40px;line-height:1.2}.hero p{margin:0;color:var(--secondary);font-size:18px}.hero-search{display:flex;width:min(100%,650px);height:56px}.hero-search label{flex:1;display:flex;align-items:center;gap:12px;padding:0 20px;background:#fff;border:1px solid var(--border);border-radius:12px 0 0 12px}.hero-search svg{width:20px;fill:none;stroke:var(--muted);stroke-width:2}.hero-search input{width:100%;border:0;outline:0;font-size:16px}.hero-search button{padding:0 32px;border:0;border-radius:0 12px 12px 0;background:var(--orange);color:#fff;font-size:16px;font-weight:600}.categories{padding-top:48px;padding-bottom:48px}.categories h2{margin:0 0 32px;font-size:28px}.category-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}.category-card{height:140px;border-radius:12px;background:var(--surface);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;font-size:14px;font-weight:500}.category-card svg{width:40px;height:40px;fill:none;stroke:var(--orange);stroke-width:1.7}.category-card small{padding:4px 10px;border-radius:999px;background:var(--orange);color:#fff;font-size:11px;font-weight:600}.category-card:hover{background:#f0f0f0}@media(max-width:700px){.hero{padding:55px 20px}.hero h1{font-size:30px}.hero p{font-size:16px}.hero-search label{padding:0 13px}.hero-search button{padding:0 20px}.category-grid{grid-template-columns:1fr}.categories h2{font-size:24px}}
</style>
