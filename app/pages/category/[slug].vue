<script setup lang="ts">
import { productPageResponseSchema } from '~/entities/product'
import { useCatalogStateStore } from '~/features/filter-products'
import { apiRequest, getCategoryProducts } from '~/shared/api'
import { LoadingState, RecoverableError } from '~/shared/ui/async-state'
import { CatalogGrid } from '~/widgets/catalog-grid'

const route = useRoute()
const router = useRouter()
const store = useCatalogStateStore()
const slug = computed(() => String(route.params.slug))

const loadProducts = () => {
  store.restore(slug.value, route.query)
  const serialized = store.serializedQuery
  const filter = Array.isArray(serialized.filter)
    ? serialized.filter
    : serialized.filter
      ? [serialized.filter]
      : undefined
  return apiRequest(
    getCategoryProducts(slug.value, {
      filter,
      page: store.page,
      pageSize: 9,
      vehicleModificationId: store.vehicleModificationId
    }),
    (value) => productPageResponseSchema.parse(value)
  )
}

const { data, status, error, refresh } = await useAsyncData(
  () => `category-${slug.value}`,
  loadProducts,
  { watch: [() => route.fullPath] }
)
const result = computed(() => data.value?.data)
const categoryName = computed(() => result.value?.categoryName ?? 'Категория товаров')
const categoryDescription = computed(
  () => result.value?.categoryDescription ?? 'Фильтруйте товары по характеристикам'
)

const navigate = async () => {
  await router.push({ query: store.serializedQuery })
}

watch(
  result,
  async (value) => {
    if (!value) return
    const validFilters: Record<string, string[]> = {}
    for (const facet of value.facets) {
      const allowed = new Set(facet.options.map((option) => option.value))
      const selected = (store.filters[facet.key] ?? []).filter((item) => allowed.has(item))
      if (selected.length) validFilters[facet.key] = selected
    }
    const currentPage = store.page
    store.replaceFilters(validFilters)
    store.setPage(value.page)
    if (
      currentPage !== value.page ||
      JSON.stringify(store.serializedQuery) !== JSON.stringify(route.query)
    ) {
      await router.replace({ query: store.serializedQuery })
    }
  },
  { immediate: true }
)

const parameterized = computed(() => Object.keys(route.query).length > 0)
useSeoMeta({
  title: () => `${categoryName.value} — каталог DAN`,
  description: () =>
    result.value?.categoryDescription || `${categoryName.value}: характеристики и фильтры товаров.`,
  robots: () => (parameterized.value ? 'noindex,follow' : 'index,follow')
})
useHead({ link: [{ rel: 'canonical', href: computed(() => `/category/${slug.value}`) }] })
</script>

<template>
  <main>
    <PageHero
      :title="categoryName"
      :subtitle="categoryDescription"
      :crumbs="[{ label: 'Каталог', to: '/catalog' }, { label: categoryName }]"
    />
    <LoadingState v-if="status === 'pending' && !result" message="Загружаем товары" />
    <RecoverableError
      v-else-if="error && !result"
      message="Не удалось загрузить товары категории."
      @retry="refresh"
    />
    <template v-else-if="result">
      <CatalogGrid :result="result" @navigate="navigate" />
    </template>
  </main>
</template>
