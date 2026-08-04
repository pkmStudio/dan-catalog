<script setup lang="ts">
import { productResponseSchema } from '~/entities/product'
import { ProductCompatibility } from '~/features/check-compatibility'
import { useVehicleSelectionStore } from '~/features/select-vehicle'
import { apiRequest, getProduct } from '~/shared/api'
import { LoadingState, RecoverableError } from '~/shared/ui/async-state'
import { ProductDetails } from '~/widgets/product-details'

const route = useRoute()
const vehicleStore = useVehicleSelectionStore()
const productId = computed(() => String(route.params.id))
const modificationId = computed(() => {
  const value = route.query.vehicleModificationId
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
})

if (modificationId.value) {
  const context = await vehicleStore.resolveFromUrl(modificationId.value)
  if (!context && vehicleStore.status === 'invalid') {
    await navigateTo({ path: route.path }, { replace: true })
  }
}
const { data, status, error, refresh } = await useAsyncData(
  () => `product-${productId.value}`,
  () => apiRequest(getProduct(productId.value), (value) => productResponseSchema.parse(value))
)
const product = computed(() => data.value?.data)
useSeoMeta({
  title: () => product.value?.seo.title ?? 'Товар DAN',
  description: () => product.value?.seo.description ?? 'Характеристики товара DAN.',
  robots: () => (modificationId.value ? 'noindex,follow' : 'index,follow')
})
useHead({
  link: [
    {
      rel: 'canonical',
      href: computed(() => product.value?.seo.canonicalPath ?? `/product/${productId.value}`)
    }
  ]
})
</script>

<template>
  <main>
    <LoadingState v-if="status === 'pending'" message="Загружаем товар" />
    <RecoverableError v-else-if="error" message="Не удалось загрузить товар." @retry="refresh" />
    <template v-else-if="product">
      <PageHero
        title="Карточка товара"
        :subtitle="product.sku"
        :crumbs="[
          { label: 'Каталог', to: '/catalog' },
          { label: 'Категория', to: `/category/${product.categoryId}` },
          { label: product.sku }
        ]"
      />
      <ProductDetails :product="product">
        <template #compatibility>
          <ProductCompatibility
            :product-id="product.id"
            :modification-id="modificationId"
            :vehicle-name="vehicleStore.confirmed?.displayName"
          />
        </template>
      </ProductDetails>
    </template>
  </main>
</template>
