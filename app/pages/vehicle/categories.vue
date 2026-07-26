<script setup lang="ts">
import type { ApiResponse, ProductGroup } from '~/types/catalog'

const vehicle = useVehicleState()
if (!vehicle.value) await navigateTo('/vehicle')
const { data } = await useFetch<ApiResponse<ProductGroup[]>>('/api/catalog/groups')
const groups = computed(() => data.value?.data || [])
</script>
<template>
  <main v-if="vehicle">
    <PageHero
      :title="`Категории для ${vehicle.makeName} ${vehicle.modelName}`"
      subtitle="Выберите группу запчастей, подходящих для вашего автомобиля"
      :crumbs="[{ label: 'Подбор по авто', to: '/vehicle' }, { label: 'Категории' }]"
    />
    <section class="content-section">
      <div class="selected-vehicle">
        <span
          ><b>Выбранный автомобиль</b
          ><small
            >{{ vehicle.makeName }} {{ vehicle.modelName }} · {{ vehicle.modification }}</small
          ></span
        >
        <NuxtLink to="/vehicle">Изменить</NuxtLink>
      </div>
      <div class="section-heading">
        <h2>Группы запчастей</h2>
        <span>16 категорий для выбранного автомобиля</span>
      </div>
      <div class="groups-grid">
        <ProductGroupCard v-for="group in groups" :key="group.id" :group="group" />
      </div>
    </section>
  </main>
</template>
