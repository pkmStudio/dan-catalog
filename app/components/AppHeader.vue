<script setup lang="ts">defineProps<{ active?: 'catalog' | 'vehicle' | 'about' | 'contacts' }>();
const open = ref(false);
const links = [['/catalog', 'Каталог', '▦', 'catalog'], ['/vehicle', 'Подбор по авто', '⌁', 'vehicle'], ['/about', 'О компании', '▥', 'about'], ['/contacts', 'Контакты', '☎', 'contacts']]</script>
<template>
  <header class="site-header">
    <div class="header-inner">
      <BrandLogo/>
      <nav class="main-nav">
        <NuxtLink v-for="link in links" :key="link[0]" :to="link[0]" :class="{active:active===link[3]}">{{
            link[1]
          }}
        </NuxtLink>
      </nav>
      <div class="desktop-search">
        <SearchBox/>
      </div>
      <button class="menu-toggle" :class="{active:open}" @click="open=!open" aria-label="Меню"><span/><span/><span/>
      </button>
    </div>
  </header>
  <div v-if="open" class="mobile-menu">
    <div class="menu-title"><b>Меню</b><small>Навигация</small></div>
    <SearchBox @navigate="open=false"/>
    <nav>
      <NuxtLink v-for="link in links" :key="link[0]" :to="link[0]" @click="open=false"><i>{{
          link[2]
        }}</i><span>{{ link[1] }}</span><b>›</b></NuxtLink>
    </nav>
    <NuxtLink class="vehicle-cta" to="/vehicle" @click="open=false"><i>⌁</i><span><b>Подобрать по автомобилю</b><small>Марка, модель и поколение</small></span><strong>→</strong>
    </NuxtLink>
    <div class="menu-phone"><span><b>+7 (800) 555-35-35</b><small>Ежедневно, 9:00–20:00</small></span><i>☎</i></div>
  </div>
</template>
