<script setup lang="ts">
import type { VehicleContext } from '~/entities/vehicle'
import { VehicleSelector, useVehicleSelectionStore } from '~/features/select-vehicle'

const route = useRoute()
const store = useVehicleSelectionStore()
const routeModificationId = computed(() => {
  const value = route.query.vehicleModificationId
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
})

if (routeModificationId.value) await store.resolveFromUrl(routeModificationId.value)

const continueToCategories = async (context: VehicleContext) => {
  await navigateTo({
    path: '/vehicle/categories',
    query: { vehicleModificationId: context.modification.id }
  })
}

useSeoMeta({
  title: 'Подбор запчастей по автомобилю — DAN',
  description: 'Выберите марку, модель и модификацию автомобиля для подбора категорий DAN.',
  robots: 'noindex,follow'
})
useHead({ link: [{ rel: 'canonical', href: '/vehicle' }] })
</script>

<template>
  <main>
    <PageHero
      title="Подбор запчастей по автомобилю"
      subtitle="Выберите марку, модель и модификацию автомобиля"
      :crumbs="[{ label: 'Подбор по авто' }]"
    />
    <section class="content-section">
      <VehicleSelector @confirmed="continueToCategories" />
    </section>
  </main>
</template>
