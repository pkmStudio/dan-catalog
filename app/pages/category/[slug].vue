<script setup lang="ts">
const products = [
  ['DAN-WB-001','Щетка стеклоочистителя DAN 400мм'],
  ['DAN-WB-002','Щетка стеклоочистителя DAN 500мм'],
  ['DAN-WB-003','Щетка стеклоочистителя DAN 600мм'],
  ['DAN-WB-004','Щетка бескаркасная DAN 450мм']
]
const filters = [
  ['Тип щетки',['Бескаркасная','Каркасная','Гибридная']],
  ['Сторона установки',['Передние','Задние']],
  ['Длина',['300 мм','400 мм','500 мм','600 мм']],
  ['Тип крепления',['Hook','Push Button','Pinch Tab']]
]
</script>

<template>
  <div class="page">
    <AppHeader active="catalog" />
    <div class="breadcrumbs container"><NuxtLink to="/">Главная</NuxtLink><span>›</span><span>Каталог</span><span>›</span><span>Щетки стеклоочистителя</span></div>
    <main class="catalog container">
      <aside class="filters">
        <h2>Фильтры</h2>
        <fieldset v-for="filter in filters" :key="filter[0]">
          <legend>{{ filter[0] }}</legend>
          <label v-for="option in filter[1]" :key="option"><input type="checkbox"><span>{{ option }}</span></label>
        </fieldset>
      </aside>
      <section class="products">
        <header><h1>Щетки стеклоочистителя</h1><span>Найдено: 48 товаров</span></header>
        <div class="products-grid"><ProductCard v-for="item in products" :key="item[0]" :sku="item[0]" :name="item[1]" /></div>
        <nav class="pagination" aria-label="Страницы"><button>‹</button><button class="current">1</button><button>2</button><button>3</button><button>4</button><button>5</button><button>›</button></nav>
      </section>
    </main>
  </div>
</template>

<style scoped>
.catalog{display:grid;grid-template-columns:260px 1fr;gap:32px;padding-bottom:48px}.filters{padding:24px;border-radius:12px;background:var(--surface)}.filters h2{margin:0 0 24px;font-size:18px}.filters fieldset{padding:0;margin:0 0 24px;border:0}.filters legend{margin-bottom:12px;font-size:14px;font-weight:500}.filters label{display:flex;align-items:center;gap:10px;margin:8px 0;color:var(--secondary);font-size:14px}.filters input{appearance:none;width:18px;height:18px;margin:0;border:1px solid #ccc;border-radius:4px;background:#fff}.filters input:checked{background:var(--orange);border-color:var(--orange);box-shadow:inset 0 0 0 4px #fff}.products{min-width:0}.products header{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px}.products h1{margin:0;font-size:24px}.products header span{color:var(--muted);font-size:14px}.products-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}.pagination{display:flex;justify-content:center;gap:8px;margin-top:24px}.pagination button{width:40px;height:40px;border:0;border-radius:8px;background:var(--surface);color:var(--secondary)}.pagination .current{background:var(--orange);color:#fff}@media(max-width:1100px){.products-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:700px){.catalog{display:block}.filters{margin-bottom:24px}.products header{align-items:flex-start;flex-direction:column;gap:8px}}@media(max-width:450px){.products-grid{grid-template-columns:1fr}}
</style>
