<script setup lang="ts">
import type { VehicleContext } from '~/entities/vehicle'
import { VehicleSelector, useVehicleSelectionStore } from '~/features/select-vehicle'
import { parsePositiveIntegerQuery } from '~/shared/lib/route-state'
import { RecoverableError } from '~/shared/ui/async-state'
import { SelectedVehicle } from '~/widgets/selected-vehicle'

const route = useRoute()
const store = useVehicleSelectionStore()
const rawModificationId = route.query.vehicleModificationId
const routeModificationId = parsePositiveIntegerQuery(rawModificationId)
const invalidRouteId = rawModificationId !== undefined && routeModificationId === undefined

if (invalidRouteId) {
  store.clear()
  store.status = 'invalid'
} else if (routeModificationId !== undefined) {
  await store.resolveFromUrl(routeModificationId)
}

const editing = ref(!store.confirmed)

const confirmVehicle = async (context: VehicleContext) => {
  editing.value = false
  await navigateTo(
    { path: '/vehicle', query: { vehicleModificationId: String(context.modification.id) } },
    { replace: true }
  )
}

const editVehicle = async () => {
  await store.beginEdit()
  editing.value = true
}

const retryResolution = async () => {
  await store.retry()
  editing.value = !store.confirmed
}

useSeoMeta({
  title: 'Выбор автомобиля — DAN',
  description: 'Выберите производителя, транспортное средство и модификацию автомобиля.',
  robots: 'noindex,follow'
})
useHead({ link: [{ rel: 'canonical', href: '/vehicle' }] })
</script>

<template>
  <main>
    <PageHero
      title="Выбор автомобиля"
      subtitle="Выберите производителя, транспортное средство и модификацию"
      :crumbs="[{ label: 'Подбор по авто' }]"
    />
    <section class="content-section">
      <RecoverableError
        v-if="store.status === 'error' && store.failedStage === 'resolution'"
        :message="store.errorMessage"
        @retry="retryResolution"
      />
      <div v-else-if="store.status === 'invalid'" class="async-state" role="status">
        <h2>Автомобиль недоступен</h2>
        <p>Сохранённый автомобиль не найден. Выполните подбор заново.</p>
        <button type="button" class="button" @click="editing = true">Подобрать автомобиль</button>
      </div>
      <SelectedVehicle
        v-else-if="store.confirmed && !editing"
        :context="store.confirmed"
        @edit="editVehicle"
      />
      <VehicleSelector v-else @confirmed="confirmVehicle" />
    </section>
  </main>
</template>
