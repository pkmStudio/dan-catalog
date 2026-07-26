<script setup lang="ts">
import type { Category } from '~/entities/category'
import { EmptyState } from '~/shared/ui/async-state'
import { ImageFallback } from '~/shared/ui/image-fallback'

defineProps<{ categories: Category[] }>()
</script>

<template>
  <section class="content-section" aria-labelledby="categories-title">
    <div class="section-heading">
      <h2 id="categories-title">Категории</h2>
      <span>{{ categories.length }}</span>
    </div>
    <div v-if="categories.length" class="groups-grid">
      <NuxtLink
        v-for="category in categories"
        :key="category.id"
        class="group-card"
        :to="`/category/${category.slug}`"
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
      title="В группе пока нет категорий"
      description="Вернитесь к каталогу и выберите другой раздел."
    >
      <NuxtLink class="button" to="/catalog">К группам товаров</NuxtLink>
    </EmptyState>
  </section>
</template>
