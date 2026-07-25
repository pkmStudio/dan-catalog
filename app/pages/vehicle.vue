<script setup lang="ts">
const makes = [['TOYOTA','70'],['HONDA','60'],['NISSAN','111'],['MAZDA','111'],['MITSUBISHI','77'],['SUBARU','92'],['LEXUS','71'],['HYUNDAI','107']]
const models = [['CAMRY','XV70','2017-'],['CAMRY','XV50','2011-2017'],['COROLLA','E210','2019-'],['RAV4','XA50','2018-'],['LAND CRUISER','300','2021-'],['HIGHLANDER','XU70','2019-']]
const mods = [['2.5 Бензин','181 л.с.','Передний','АКПП'],['2.5 Гибрид','218 л.с.','Передний','CVT'],['3.5 Бензин','301 л.с.','Передний','АКПП'],['2.5 Гибрид AWD','222 л.с.','Полный','CVT']]
const selectedMake = ref('TOYOTA')
const selectedModel = ref('CAMRY')
const selectedMod = ref('2.5 Бензин')
const makeSearch = ref('')
const modelSearch = ref('')
const visibleMakes = computed(() => makes.filter(x => x[0].includes(makeSearch.value.toUpperCase())))
const visibleModels = computed(() => models.filter(x => x[0].includes(modelSearch.value.toUpperCase())))
</script>

<template>
  <div class="page">
    <AppHeader active="vehicle" />
    <main class="vehicle container">
      <header class="title"><h1>Подбор запчастей по автомобилю</h1><p>Выберите марку, модель и модификацию вашего автомобиля</p></header>
      <div class="steps">
        <section class="step"><h2><b>1</b>Марка автомобиля</h2><label class="search-field"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input v-model="makeSearch" placeholder="Поиск марки..."></label><div class="list"><button v-for="make in visibleMakes" :key="make[0]" :class="{selected:selectedMake===make[0]}" @click="selectedMake=make[0]"><strong>{{ make[0] }}</strong><small>{{ make[1] }}</small></button></div></section>
        <section class="step"><h2><b>2</b>Модель</h2><label class="search-field"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input v-model="modelSearch" placeholder="Поиск модели..."></label><div class="list"><button v-for="model in visibleModels" :key="model.join()" :class="{selected:selectedModel===model[0] && model[1]==='XV70'}" @click="selectedModel=model[0]"><strong>{{ model[0] }}</strong><small>{{ model[1] }}</small><span>{{ model[2] }}</span></button></div></section>
        <section class="step"><h2><b>3</b>Модификация</h2><div class="list mods"><button v-for="mod in mods" :key="mod[0]" :class="{selected:selectedMod===mod[0]}" @click="selectedMod=mod[0]"><span class="mod-top"><strong>{{ mod[0] }}</strong><span>{{ mod[1] }}</span></span><span class="mod-bottom"><small>{{ mod[2] }}</small><small>{{ mod[3] }}</small></span></button></div><div class="action"><NuxtLink to="/category/wipers" class="orange-button">⌕&nbsp; Найти запчасти</NuxtLink><small>Найдено товаров: 156</small></div></section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.vehicle{padding-top:32px;padding-bottom:48px}.title{margin-bottom:32px}.title h1{margin:0 0 8px;font-size:32px}.title p{margin:0;color:var(--secondary);font-size:16px}.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}.step{padding:24px;border-radius:12px;background:var(--surface);display:flex;flex-direction:column;gap:16px}.step h2{display:flex;align-items:center;gap:12px;margin:0;font-size:16px}.step h2 b{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;background:var(--orange);color:#fff;font-size:14px}.list{display:flex;flex-direction:column;gap:4px}.list button{min-height:40px;padding:10px 12px;border:1px solid transparent;border-radius:4px;background:#fff;color:var(--text);display:flex;align-items:center;gap:12px;text-align:left}.list button strong{font-size:14px;font-weight:400}.list button small{color:var(--muted);font-size:12px}.list button span:last-child{color:var(--secondary);font-size:12px}.list button small:last-child{margin-left:auto}.list .selected{border-color:var(--orange);background:#fff7ed;color:var(--orange)}.list .selected strong{font-weight:600}.mods{gap:8px}.mods button{display:block;padding:12px}.mod-top,.mod-bottom{display:flex;justify-content:space-between;gap:10px}.mod-bottom{justify-content:flex-start;margin-top:6px}.mod-bottom small:last-child{margin-left:6px}.action{margin-top:auto;display:flex;flex-direction:column;align-items:center;gap:12px}.action a{width:100%;padding:14px 24px;text-align:center;font-size:15px}.action small{color:var(--secondary)}@media(max-width:1000px){.steps{grid-template-columns:1fr}.step{max-width:700px;width:100%;margin:auto}}@media(max-width:600px){.title h1{font-size:27px}.vehicle{padding-top:24px}.step{padding:18px}}
</style>
