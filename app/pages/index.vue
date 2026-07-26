<script setup lang="ts">
import heroDesktop from '~/shared/assets/images/home-hero-desktop.jpg'
import heroMobile from '~/shared/assets/images/home-hero-mobile.png'
</script>

<template>
  <main class="home">
    <section class="home-hero">
      <picture class="home-hero-media" aria-hidden="true">
        <source media="(max-width: 640px)" :srcset="heroMobile" />
        <img :src="heroDesktop" alt="" />
      </picture>
      <div class="home-hero-content">
        <h1>Электронный каталог автозапчастей DAN</h1>
        <p>Найдите нужную запчасть по артикулу или названию</p>
        <SearchBox hero />
      </div>
    </section>
  </main>
</template>
