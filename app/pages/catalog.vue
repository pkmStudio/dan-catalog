<script setup lang="ts">import type {ApiResponse, ProductGroup} from '~/types/catalog';

const {data, status, error, refresh} = await useFetch<ApiResponse<ProductGroup[]>>('/api/catalog/groups');
const groups = computed(() => data.value?.data || [])</script>
<template>
  <main>
    <PageHero title="Каталог запчастей" subtitle="Выберите группу товаров, чтобы перейти к подходящим запчастям"
              :crumbs="[{label:'Каталог'}]"/>
    <section class="content-section">
      <div class="section-heading"><h2>Группы запчастей</h2><span>{{ groups.length }} категорий</span></div>
      <LoadingState v-if="status==='pending'||error" :error="error?.message" @retry="refresh"/>
      <div v-else class="groups-grid">
        <ProductGroupCard v-for="group in groups" :key="group.id" :group="group"/>
      </div>
    </section>
  </main>
</template>
