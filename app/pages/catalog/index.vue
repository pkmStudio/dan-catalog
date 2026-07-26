<script setup lang="ts">
import { productGroupListResponseSchema } from '~/entities/product-group'
import { apiRequest, getProductGroups } from '~/shared/api'
import { createPageSeo } from '~/shared/lib/seo'
import { RecoverableError, LoadingState } from '~/shared/ui/async-state'
import { ProductGroupGrid } from '~/widgets/product-group-grid'

const { data, status, error, refresh } = await useAsyncData('catalog-groups', () =>
  apiRequest(getProductGroups(), (value) => productGroupListResponseSchema.parse(value))
)
const groups = computed(() => data.value?.data ?? [])
const seo = createPageSeo({
  title: 'Каталог автотоваров DAN',
  description: 'Группы и категории автотоваров DAN.',
  canonicalPath: '/catalog'
})
useSeoMeta({
  title: seo.title,
  description: seo.description,
  robots: seo.robots
})
useHead({ link: [{ rel: 'canonical', href: seo.canonicalUrl }] })
</script>

<template>
  <main>
    <PageHero
      title="Каталог автотоваров"
      subtitle="Выберите группу, затем категорию нужных деталей"
      :crumbs="[{ label: 'Каталог' }]"
    />
    <LoadingState v-if="status === 'pending'" message="Загружаем группы товаров" />
    <RecoverableError v-else-if="error" message="Не удалось загрузить каталог." @retry="refresh" />
    <ProductGroupGrid v-else :groups="groups" />
  </main>
</template>
