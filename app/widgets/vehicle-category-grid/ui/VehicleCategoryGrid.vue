<script setup lang="ts">
import type { Category } from '~/entities/category'
import { EmptyState } from '~/shared/ui/async-state'
import { ImageFallback } from '~/shared/ui/image-fallback'

defineProps<{
  categories: Category[]
  modificationId: string
}>()
</script>

<template>
  <section class="content-section" aria-labelledby="vehicle-categories-title">
    <div class="section-heading">
      <h2 id="vehicle-categories-title">Подходящие категории</h2>
      <span>{{ categories.length }}</span>
    </div>

    <div v-if="categories.length" class="groups-grid">
      <NuxtLink
        v-for="category in categories"
        :key="category.id"
        class="group-card"
        :to="{
          path: `/category/${category.slug}`,
          query: { vehicleModificationId: modificationId }
        }"
      >
        <span class="group-card__image">
          <ImageFallback :src="category.image" :alt="category.name" />
        </span>
        <span class="group-card__content">
          <b>{{ category.name }}</b>
          <small>{{ category.productCount }} товаров</small>
        </span>
        <i aria-hidden="true">›</i>
      </NuxtLink>
    </div>

    <EmptyState
      v-else
      title="Для автомобиля пока нет категорий"
      description="Измените автомобиль или вернитесь в общий каталог."
    >
      <NuxtLink class="button" to="/vehicle">Изменить автомобиль</NuxtLink>
      <NuxtLink class="button button-outline" to="/catalog">Открыть общий каталог</NuxtLink>
    </EmptyState>
  </section>
</template>
