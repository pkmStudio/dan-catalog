<script setup lang="ts">
import { ProductSearch } from '~/features/product-search'

type ActiveSection = 'catalog' | 'vehicle' | 'about' | 'contacts'

interface NavigationItem {
  to: string
  label: string
  icon: string
  section: ActiveSection
}

defineProps<{
  active?: ActiveSection
}>()

const isOpen = ref(false)

const links: NavigationItem[] = [
  { to: '/catalog', label: 'Каталог', icon: '▦', section: 'catalog' },
  { to: '/vehicle', label: 'Подбор по авто', icon: '⌁', section: 'vehicle' },
  { to: '/about', label: 'О компании', icon: '▥', section: 'about' },
  { to: '/contacts', label: 'Контакты', icon: '☎', section: 'contacts' }
]
</script>

<template>
  <header class="site-header">
    <div class="header-inner">
      <BrandLogo />

      <nav class="main-nav" aria-label="Основная навигация">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          :class="{ active: active === link.section }"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <div class="desktop-search">
        <ProductSearch surface="header" />
      </div>

      <button
        class="menu-toggle"
        :class="{ active: isOpen }"
        type="button"
        aria-label="Меню"
        :aria-expanded="isOpen"
        @click="isOpen = !isOpen"
      >
        <span />
        <span />
        <span />
      </button>
    </div>
  </header>

  <div v-if="isOpen" class="mobile-menu">
    <div class="menu-title">
      <b>Меню</b>
      <small>Навигация</small>
    </div>

    <ProductSearch surface="mobile-menu" @navigate="isOpen = false" />

    <nav aria-label="Мобильная навигация">
      <NuxtLink v-for="link in links" :key="link.to" :to="link.to" @click="isOpen = false">
        <i aria-hidden="true">{{ link.icon }}</i>
        <span>{{ link.label }}</span>
        <b aria-hidden="true">›</b>
      </NuxtLink>
    </nav>

    <NuxtLink class="vehicle-cta" to="/vehicle" @click="isOpen = false">
      <i aria-hidden="true">⌁</i>
      <span>
        <b>Подобрать по автомобилю</b>
        <small>Марка, модель и поколение</small>
      </span>
      <strong aria-hidden="true">→</strong>
    </NuxtLink>

    <div class="menu-phone">
      <span>
        <b>+7 (800) 555-35-35</b>
        <small>Ежедневно, 9:00–20:00</small>
      </span>
      <i aria-hidden="true">☎</i>
    </div>
  </div>
</template>
