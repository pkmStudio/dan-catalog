<script setup lang="ts">
import { categoryListResponseSchema } from '~/entities/category'
import { productGroupListResponseSchema } from '~/entities/product-group'
import { apiRequest, getGroupCategories, getProductGroups } from '~/shared/api'
import { LoadingState, RecoverableError } from '~/shared/ui/async-state'
import { CategoryGrid } from '~/widgets/category-grid'

const route = useRoute()
const groupId = computed(() => String(route.params.groupId))
const { data, status, error, refresh } = await useAsyncData(
  () => `catalog-group-${groupId.value}`,
  async () => {
    const [groupResponse, categoryResponse] = await Promise.all([
      apiRequest(getProductGroups(), (value) => productGroupListResponseSchema.parse(value)),
      apiRequest(getGroupCategories(groupId.value), (value) =>
        categoryListResponseSchema.parse(value)
      )
    ])

    return {
      group: groupResponse.data.find((item) => item.id === groupId.value),
      categories: categoryResponse.data
    }
  }
)
const categories = computed(() => data.value?.categories ?? [])
const groupName = computed(() => data.value?.group?.name ?? 'Категории товаров')
const groupDescription = computed(
  () => data.value?.group?.description ?? 'Выберите категорию для просмотра товаров'
)
useSeoMeta({
  title: () => `${groupName.value} — каталог DAN`,
  description: () => groupDescription.value,
  robots: 'index,follow'
})
useHead({
  link: [{ rel: 'canonical', href: computed(() => `/catalog/${groupId.value}`) }]
})
</script>

<template>
  <main>
    <PageHero
      :title="groupName"
      :subtitle="groupDescription"
      :crumbs="[{ label: 'Каталог', to: '/catalog' }, { label: groupName }]"
    />
    <LoadingState v-if="status === 'pending'" message="Загружаем категории" />
    <RecoverableError
      v-else-if="error"
      message="Не удалось загрузить категории."
      @retry="refresh"
    />
    <CategoryGrid v-else :categories="categories" />
  </main>
</template>
