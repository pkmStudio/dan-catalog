<script setup lang="ts">
import {
  formatCatalogVehicle,
  formatVehicleModification,
  type VehicleContext
} from '~/entities/vehicle'
import { AppButton } from '~/shared/ui/button'
import { EmptyState, RecoverableError } from '~/shared/ui/async-state'
import { FormField } from '~/shared/ui/form-field'
import { useVehicleSelectionStore } from '../model'

const emit = defineEmits<{ confirmed: [context: VehicleContext] }>()
const store = useVehicleSelectionStore()

onMounted(async () => {
  if (!store.manufacturers.length) await store.loadManufacturers()
})

const valueAsId = (event: Event): number | undefined => {
  const value = (event.target as HTMLSelectElement).value
  if (!value) return undefined
  const id = Number(value)
  return Number.isSafeInteger(id) && id > 0 ? id : undefined
}

const changeManufacturer = async (event: Event) => store.selectManufacturer(valueAsId(event))
const changeVehicle = async (event: Event) => store.selectVehicle(valueAsId(event))
const changeModification = (event: Event) => store.selectModification(valueAsId(event))

const submit = async () => {
  const context = store.confirmSelection()
  if (context) {
    emit('confirmed', context)
    return
  }
  await nextTick()
  const firstInvalid = document.querySelector<HTMLElement>('[aria-invalid="true"]')
  firstInvalid?.focus()
}

const retryFailedStage = async () => {
  const stage = store.failedStage
  await store.retry()
  await nextTick()
  const targetId = {
    manufacturers: 'vehicle-manufacturer',
    vehicles: 'catalog-vehicle',
    modifications: 'vehicle-modification',
    resolution: 'vehicle-manufacturer'
  }[stage ?? 'manufacturers']
  document.getElementById(targetId)?.focus()
}
</script>

<template>
  <form class="vehicle-selector" novalidate @submit.prevent="submit">
    <div class="selector-title">
      <h2>
        {{
          !store.manufacturerId
            ? 'Шаг 1 из 3 · Выберите производителя'
            : !store.vehicleId
              ? 'Шаг 2 из 3 · Выберите транспортное средство'
              : 'Шаг 3 из 3 · Выберите модификацию'
        }}
      </h2>
      <span>Подбор по авто</span>
    </div>

    <p class="sr-only" role="status" aria-live="polite">
      {{ store.status === 'loading' ? 'Загрузка данных автомобиля' : store.errorMessage }}
    </p>

    <RecoverableError
      v-if="store.status === 'error'"
      :message="store.errorMessage"
      @retry="retryFailedStage"
    />
    <EmptyState
      v-else-if="!store.manufacturers.length && store.status !== 'loading'"
      title="Производители пока недоступны"
      description="Попробуйте загрузить список ещё раз."
    >
      <AppButton @click="store.loadManufacturers()">Повторить</AppButton>
    </EmptyState>

    <div v-else class="select-row">
      <FormField
        id="vehicle-manufacturer"
        label="Производитель"
        required
        :error="store.validationErrors.manufacturer"
      >
        <template #default="{ id, invalid, describedBy }">
          <select
            :id="id"
            :value="store.manufacturerId ?? ''"
            :disabled="store.status === 'loading' && store.failedStage === 'manufacturers'"
            :aria-invalid="invalid"
            :aria-describedby="describedBy"
            @change="changeManufacturer"
          >
            <option value="">Выберите производителя</option>
            <option
              v-for="manufacturer in store.manufacturers"
              :key="manufacturer.id"
              :value="manufacturer.id"
            >
              {{ manufacturer.name }}
            </option>
          </select>
        </template>
      </FormField>

      <FormField
        id="catalog-vehicle"
        label="Транспортное средство"
        required
        :error="store.validationErrors.vehicle"
      >
        <template #default="{ id, invalid, describedBy }">
          <select
            :id="id"
            :value="store.vehicleId ?? ''"
            :disabled="
              !store.manufacturerId ||
              (store.status === 'loading' && store.failedStage === 'vehicles')
            "
            :aria-invalid="invalid"
            :aria-describedby="describedBy"
            @change="changeVehicle"
          >
            <option value="">Выберите транспортное средство</option>
            <option v-for="vehicle in store.vehicles" :key="vehicle.id" :value="vehicle.id">
              {{ formatCatalogVehicle(vehicle) }}
            </option>
          </select>
        </template>
      </FormField>

      <FormField
        id="vehicle-modification"
        label="Модификация"
        required
        :error="store.validationErrors.modification"
      >
        <template #default="{ id, invalid, describedBy }">
          <select
            :id="id"
            :value="store.modificationId ?? ''"
            :disabled="
              !store.vehicleId ||
              (store.status === 'loading' && store.failedStage === 'modifications')
            "
            :aria-invalid="invalid"
            :aria-describedby="describedBy"
            @change="changeModification"
          >
            <option value="">Выберите модификацию</option>
            <option
              v-for="modification in store.modifications"
              :key="modification.id"
              :value="modification.id"
            >
              {{ formatVehicleModification(modification) }}
            </option>
          </select>
        </template>
      </FormField>
    </div>

    <p
      v-if="
        store.manufacturerId &&
        !store.vehicles.length &&
        store.status !== 'loading' &&
        store.status !== 'error'
      "
      role="status"
    >
      У выбранного производителя нет доступных транспортных средств. Выберите другого производителя.
    </p>
    <p
      v-if="
        store.vehicleId &&
        !store.modifications.length &&
        store.status !== 'loading' &&
        store.status !== 'error'
      "
      role="status"
    >
      У выбранного транспортного средства нет модификаций. Вернитесь к предыдущему шагу.
    </p>

    <AppButton
      v-if="store.manufacturers.length"
      type="submit"
      :loading="store.status === 'loading'"
    >
      Подтвердить автомобиль
    </AppButton>
  </form>
</template>
