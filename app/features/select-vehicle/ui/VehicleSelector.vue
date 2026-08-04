<script setup lang="ts">
import type { VehicleContext } from '~/entities/vehicle'
import { useVehicleSelectionStore } from '../model'
import { AppButton } from '~/shared/ui/button'
import { EmptyState, LoadingState, RecoverableError } from '~/shared/ui/async-state'
import { FormField } from '~/shared/ui/form-field'

const emit = defineEmits<{
  confirmed: [context: VehicleContext]
}>()

const store = useVehicleSelectionStore()

onMounted(async () => {
  if (!store.makes.length) await store.loadMakes()
})

const changeMake = async (event: Event) => {
  await store.selectMake((event.target as HTMLSelectElement).value)
}

const changeModel = async (event: Event) => {
  await store.selectModel((event.target as HTMLSelectElement).value)
}

const changeModification = (event: Event) => {
  store.selectModification((event.target as HTMLSelectElement).value)
}

const submit = () => {
  const context = store.confirmSelection()
  if (context) emit('confirmed', context)
}
</script>

<template>
  <form class="vehicle-selector" novalidate @submit.prevent="submit">
    <div class="selector-title">
      <h2>
        {{
          !store.makeId
            ? 'Шаг 1 из 3 · Выберите марку'
            : !store.modelId
              ? 'Шаг 2 из 3 · Выберите модель'
              : 'Шаг 3 из 3 · Выберите модификацию'
        }}
      </h2>
      <span>Подбор по авто</span>
    </div>

    <LoadingState
      v-if="store.status === 'loading' && !store.makes.length"
      message="Загружаем марки автомобилей"
    />
    <RecoverableError
      v-else-if="store.status === 'error'"
      :message="store.errorMessage"
      @retry="store.retry()"
    />
    <EmptyState
      v-else-if="!store.makes.length"
      title="Марки пока недоступны"
      description="Попробуйте загрузить список ещё раз."
    >
      <AppButton @click="store.loadMakes()">Повторить</AppButton>
    </EmptyState>
    <template v-else>
      <div class="select-row">
        <FormField id="vehicle-make" label="Марка" required :error="store.validationErrors.make">
          <template #default="{ id, invalid, describedBy }">
            <select
              :id="id"
              :value="store.makeId"
              :aria-invalid="invalid"
              :aria-describedby="describedBy"
              @change="changeMake"
            >
              <option value="">Выберите марку</option>
              <option v-for="make in store.makes" :key="make.id" :value="make.id">
                {{ make.name }}
              </option>
            </select>
          </template>
        </FormField>

        <FormField id="vehicle-model" label="Модель" required :error="store.validationErrors.model">
          <template #default="{ id, invalid, describedBy }">
            <select
              :id="id"
              :value="store.modelId"
              :disabled="!store.makeId || store.status === 'loading'"
              :aria-invalid="invalid"
              :aria-describedby="describedBy"
              @change="changeModel"
            >
              <option value="">Выберите модель</option>
              <option v-for="model in store.models" :key="model.id" :value="model.id">
                {{ model.name }}
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
              :value="store.modificationId"
              :disabled="!store.modelId || store.status === 'loading'"
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
                {{ modification.displayName }}
              </option>
            </select>
          </template>
        </FormField>
      </div>

      <p v-if="store.makeId && !store.models.length && store.status !== 'loading'" role="status">
        Для выбранной марки моделей пока нет.
      </p>
      <p
        v-if="store.modelId && !store.modifications.length && store.status !== 'loading'"
        role="status"
      >
        Для выбранной модели модификаций пока нет.
      </p>

      <AppButton type="submit" :loading="store.status === 'loading'">
        Показать подходящие категории
      </AppButton>
    </template>
  </form>
</template>
