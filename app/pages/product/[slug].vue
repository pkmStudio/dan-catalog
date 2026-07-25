<script setup lang="ts">
const activeTab = ref('Применяемость')
const specs = [['Длина','600 мм'],['Тип','Бескаркасная'],['Крепление','Hook (крючок)'],['Материал резинки','Натуральный каучук'],['Гарантия','12 месяцев']]
const cars = [['TOYOTA','CAMRY','XV70','2017-'],['TOYOTA','RAV4','XA50','2018-'],['HONDA','CR-V','RW','2017-2022'],['MAZDA','CX-5','KF','2017-']]
</script>

<template>
  <div class="page">
    <AppHeader active="catalog" />
    <div class="crumb-wrap"><div class="breadcrumbs container"><NuxtLink to="/">Главная</NuxtLink><span>/</span><NuxtLink to="/category/wipers">Каталог</NuxtLink><span>/</span><span>Щетки стеклоочистителя</span><span>/</span><b>LW-600</b></div></div>
    <main class="product container">
      <div class="photo"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg><span>Изображение товара</span></div>
      <section class="info">
        <div class="sku"><span>Артикул:</span><b>LW-600</b><em>DAN</em></div>
        <h1>Щетка стеклоочистителя бескаркасная 600 мм</h1>
        <p class="description">Бескаркасная щетка стеклоочистителя с адаптером Hook. Подходит для большинства автомобилей. Обеспечивает равномерный прижим по всей длине.</p>
        <section class="specs"><h2>Характеристики</h2><dl><div v-for="spec in specs" :key="spec[0]"><dt>{{ spec[0] }}</dt><dd>{{ spec[1] }}</dd></div></dl></section>
        <section class="tabs">
          <div class="tab-buttons"><button v-for="tab in ['Применяемость','OEM номера','Аналоги']" :key="tab" :class="{active:activeTab===tab}" @click="activeTab=tab">{{ tab }}</button></div>
          <div class="tab-content" v-if="activeTab==='Применяемость'"><div v-for="car in cars" :key="car[1]"><b>{{ car[0] }}</b><span>{{ car[1] }}</span><small>{{ car[2] }}</small><span>{{ car[3] }}</span></div><a href="#">Показать все (24 автомобиля) →</a></div>
          <div class="tab-content empty" v-else>Информация будет добавлена позднее.</div>
        </section>
        <aside class="question"><h3>◯ Есть вопрос по товару?</h3><p>Оставьте заявку и наши специалисты свяжутся с вами</p><button class="orange-button">Задать вопрос</button></aside>
      </section>
    </main>
  </div>
</template>

<style scoped>
.crumb-wrap{background:var(--surface)}.product{display:grid;grid-template-columns:500px 1fr;gap:48px;padding-top:32px;padding-bottom:48px}.photo{height:400px;border-radius:12px;background:var(--surface);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:var(--muted);font-size:14px}.photo svg{width:80px;fill:none;stroke:var(--muted);stroke-width:1}.info{display:flex;flex-direction:column;gap:24px}.sku{display:flex;align-items:center;gap:16px;color:var(--muted);font-size:14px}.sku b{color:var(--orange)}.sku em{padding:4px 12px;border-radius:4px;background:var(--black);color:#fff;font-size:12px;font-style:normal;font-weight:600}.info h1{margin:0;font-size:28px}.description{margin:0;color:var(--secondary);font-size:15px;line-height:1.6}.specs h2{margin:0 0 12px;font-size:16px}.specs dl{margin:0}.specs dl div{display:grid;grid-template-columns:150px 1fr;gap:16px;margin:8px 0;font-size:14px}.specs dt{color:var(--secondary)}.specs dd{margin:0;font-weight:500}.tab-buttons{display:flex}.tab-buttons button{padding:12px 20px;border:0;background:var(--surface);font-weight:500}.tab-buttons button:first-child{border-radius:8px 0 0 8px}.tab-buttons button:last-child{border-radius:0 8px 8px 0}.tab-buttons .active{background:var(--orange);color:#fff}.tab-content{padding:16px;border-radius:8px;background:var(--surface);font-size:13px}.tab-content div{display:grid;grid-template-columns:80px 100px 60px 1fr;gap:16px;padding:8px 0}.tab-content small{color:var(--muted)}.tab-content a{display:block;margin-top:5px;color:var(--orange)}.tab-content.empty{color:var(--secondary)}.question{padding:16px;border:1px solid var(--orange);border-radius:8px;background:#fff7ed}.question h3{margin:0 0 12px;font-size:15px}.question p{margin:0 0 12px;color:var(--secondary);font-size:13px}.question button{padding:10px 20px}@media(max-width:900px){.product{grid-template-columns:1fr}.photo{height:320px}}@media(max-width:520px){.product{gap:24px}.info h1{font-size:24px}.tab-buttons{overflow:auto}.tab-buttons button{white-space:nowrap}.tab-content div{grid-template-columns:70px 1fr 50px 70px;gap:6px}.specs dl div{grid-template-columns:130px 1fr}}
</style>
