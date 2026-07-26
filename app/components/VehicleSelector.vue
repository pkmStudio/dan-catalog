<script setup lang="ts">
import type {ApiResponse, VehicleMake, VehicleModel} from '~/types/catalog';

const vehicle = useVehicleState();
const makeId = ref(vehicle.value?.makeId || '');
const modelId = ref(vehicle.value?.modelId || '');
const modification = ref(vehicle.value?.modification || '');
const {data: makeResult} = await useFetch<ApiResponse<VehicleMake[]>>('/api/vehicles/makes');
const makes = computed(() => makeResult.value?.data || []);
const models = ref<VehicleModel[]>([]);
watch(makeId, async id => {
  modelId.value = '';
  modification.value = '';
  models.value = id ? (await $fetch<ApiResponse<VehicleModel[]>>('/api/vehicles/models', {query: {makeId: id}})).data : []
}, {immediate: true});
const selectedModel = computed(() => models.value.find(x => x.id === modelId.value));
const save = async () => {
  const make = makes.value.find(x => x.id === makeId.value);
  if (!make || !selectedModel.value || !modification.value) return;
  vehicle.value = {
    makeId: make.id,
    makeName: make.name,
    modelId: selectedModel.value.id,
    modelName: selectedModel.value.name,
    modification: modification.value
  };
  await nextTick();
  await navigateTo('/vehicle/categories')
}
</script>
<template>
  <div class="vehicle-selector">
    <div class="selector-title"><h2>{{
        !makeId ? 'Шаг 1 из 3 · Выберите марку' : !modelId ? 'Шаг 2 из 3 · Выберите модель' : 'Шаг 3 из 3 · Выберите модификацию'
      }}</h2><span>Подбор по авто</span></div>
    <div class="select-row"><label>Марка<select v-model="makeId">
      <option value="">Выберите марку</option>
      <option v-for="make in makes" :key="make.id" :value="make.id">{{ make.name }}</option>
    </select></label><label>Модель<select v-model="modelId" :disabled="!makeId">
      <option value="">Выберите модель</option>
      <option v-for="model in models" :key="model.id" :value="model.id">{{ model.name }}</option>
    </select></label><label>Модификация<select v-model="modification" :disabled="!modelId">
      <option value="">Выберите модификацию</option>
      <option v-for="mod in selectedModel?.generations" :key="mod">{{ mod }}</option>
    </select></label></div>
    <button type="button" class="button" :disabled="!modification" @click="save">
      Показать подходящие категории
    </button>
  </div>
</template>
