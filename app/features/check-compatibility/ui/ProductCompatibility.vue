<script setup lang="ts">
import { CompatibilityStatus } from '~/entities/compatibility'
import { useProductCompatibility } from '../model'
import { LoadingState, RecoverableError } from '~/shared/ui/async-state'

const props = defineProps<{
  productId: string
  modificationId?: string
  vehicleName?: string
}>()

const productId = computed(() => props.productId)
const modificationId = computed(() => props.modificationId)
const { errorMessage, load, result, status } = useProductCompatibility(productId, modificationId)
</script>

<template>
  <section aria-label="Проверка совместимости">
    <div v-if="!modificationId" class="compatibility-prompt">
      <strong>Проверьте совместимость с автомобилем</strong>
      <NuxtLink to="/vehicle">Выбрать автомобиль</NuxtLink>
    </div>
    <LoadingState v-else-if="status === 'loading'" message="Проверяем совместимость" />
    <RecoverableError
      v-else-if="status === 'error'"
      title="Совместимость не проверена"
      :message="errorMessage"
      @retry="load"
    />
    <CompatibilityStatus
      v-else-if="result"
      :result="result"
      :vehicle-name="vehicleName || 'Выбранный автомобиль'"
    />
  </section>
</template>

<style scoped>
.compatibility-prompt {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border: 1px dashed var(--border-medium);
  border-radius: var(--radius-lg);
}

.compatibility-prompt a {
  color: var(--brand-orange);
  font-weight: var(--font-weight-semibold);
}
</style>
