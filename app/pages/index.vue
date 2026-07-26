<script setup lang="ts">
import heroDesktop from '~/shared/assets/images/home-hero-desktop.jpg'
import heroMobile from '~/shared/assets/images/home-hero-mobile.png'
import { createPageSeo } from '~/shared/lib/seo'
import { SearchHero } from '~/widgets/search-hero'

const route = useRoute()
const seo = computed(() =>
  createPageSeo({
    title: 'Автозапчасти DAN — электронный каталог',
    description: 'Найдите автозапчасти DAN по артикулу или названию в электронном каталоге.',
    canonicalPath: '/',
    noindex: typeof route.query.q === 'string' && Boolean(route.query.q.trim())
  })
)

useSeoMeta({
  title: () => seo.value.title,
  description: () => seo.value.description,
  robots: () => seo.value.robots
})

useHead({
  link: [{ rel: 'canonical', href: () => seo.value.canonicalUrl }]
})
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
        <SearchHero />
      </div>
    </section>
  </main>
</template>
