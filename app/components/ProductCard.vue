<script setup lang="ts">
defineProps<{ sku: string; name: string }>()
</script>

<template>
  <article class="product-card">
    <div class="product-image" aria-label="Изображение товара">
      <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
    </div>
    <small>{{ sku }}</small>
    <h3>{{ name }}</h3>
    <NuxtLink to="/product/lw-600" class="button">Подробнее</NuxtLink>
  </article>
</template>

<style scoped>
.product-card{min-width:0;padding:16px;border-radius:12px;background:var(--surface);display:flex;flex-direction:column;gap:12px}.product-image{height:140px;border-radius:8px;background:var(--border);display:grid;place-items:center}.product-image svg{width:38px;fill:none;stroke:#aaa;stroke-width:1.5}.product-card small{color:var(--muted);font-size:12px}.product-card h3{font-size:14px;font-weight:500;line-height:1.35;min-height:38px}.button{margin-top:auto;height:40px;border-radius:8px;background:var(--orange);color:#fff;display:grid;place-items:center;font-size:14px;font-weight:500}.button:hover{background:var(--orange-dark)}
</style>
