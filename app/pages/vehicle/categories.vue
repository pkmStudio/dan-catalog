<script setup lang="ts">
import { categoryListResponseSchema } from '~/entities/category'
import { useVehicleSelectionStore } from '~/features/select-vehicle'
import { apiRequest, getModificationCategories } from '~/shared/api'
import { LoadingState, RecoverableError } from '~/shared/ui/async-state'
import { SelectedVehicle } from '~/widgets/selected-vehicle'
import { VehicleCategoryGrid } from '~/widgets/vehicle-category-grid'

const route = useRoute()
const store = useVehicleSelectionStore()
const modificationId =
  typeof route.query.vehicleModificationId === 'string'
    ? route.query.vehicleModificationId.trim()
    : ''

const context = modificationId ? await store.resolveFromUrl(modificationId) : undefined
if (!context && store.status !== 'error') {
  await navigateTo(
    {
      path: '/vehicle',
      query: store.status === 'invalid' ? {} : route.query
    },
    { replace: true }
  )
}

const { data, status, error, refresh } = await useAsyncData(
  () => `vehicle-categories-${modificationId}`,
  () =>
    apiRequest(getModificationCategories(modificationId), (value) =>
      categoryListResponseSchema.parse(value)
    )
)
const categories = computed(() => data.value?.data ?? [])

useSeoMeta({
  title: () => `Категории для ${context?.make.name ?? 'автомобиля'} — DAN`,
  description: 'Категории товаров DAN, применимые к выбранной модификации автомобиля.',
  robots: 'noindex,follow'
})
useHead({ link: [{ rel: 'canonical', href: '/vehicle/categories' }] })
</script>

<template>
  <main v-if="context">
    <PageHero
      :title="`Категории для ${context.make.name} ${context.model.name}`"
      subtitle="Выберите группу запчастей, подходящих для вашего автомобиля"
      :crumbs="[{ label: 'Подбор по авто', to: '/vehicle' }, { label: 'Категории' }]"
    />
    <section class="content-section vehicle-context">
      <SelectedVehicle :context="context" />
      <LoadingState v-if="status === 'pending' && !data" message="Загружаем категории" />
      <RecoverableError
        v-else-if="error && !data"
        message="Не удалось загрузить категории для автомобиля."
        @retry="refresh"
      />
    </section>
    <VehicleCategoryGrid
      v-if="!error || data"
      :categories="categories"
      :modification-id="modificationId"
    />
  </main>
</template>
