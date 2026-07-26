<script setup lang="ts">
import type {ApiResponse, Paginated, Product} from '~/types/catalog';

const route = useRoute();
const filters = useCatalogFilters();
const page = ref(1);
const query = computed(() => ({page: page.value, pageSize: 12, filters: JSON.stringify(filters.value)}));
const {data, status, error, refresh} = await useFetch<ApiResponse<Paginated<Product>>>('/api/products', {
  query,
  watch: [query]
});
const result = computed(() => {
  const base = data.value?.data;
  if (!base) return;
  const q = String(route.query.q || '').toLowerCase();
  return q ? {...base, items: base.items.filter(x => `${x.sku} ${x.name}`.toLowerCase().includes(q))} : base
});
const chips = computed(() => ([...filters.value.types, ...filters.value.sides, ...filters.value.lengths.map(x => `${x} мм`), ...filters.value.mounts]));
const reset = () => filters.value = {types: [], sides: [], lengths: [], mounts: []}
</script>
<template>
  <main>
    <PageHero title="Щетки стеклоочистителя" subtitle="Подберите щетки по типу, длине и креплению"
              :crumbs="[{label:'Каталог',to:'/catalog'},{label:'Щетки стеклоочистителя'}]"/>
    <section class="catalog-layout">
      <CatalogToolbar/>
      <div class="products-area">
        <div class="section-heading"><h2>Товары категории</h2><span>Найдено: {{ result?.total || 0 }} товаров</span>
        </div>
        <div v-if="chips.length" class="chips"><span>Применено:</span><b v-for="chip in chips" :key="chip">{{
            chip
          }}</b>
          <button @click="reset">Сбросить все</button>
        </div>
        <LoadingState v-if="status==='pending'||error" :error="error?.message" @retry="refresh"/>
        <template v-else-if="result?.items.length">
          <div class="products-grid">
            <ProductCard v-for="product in result.items" :key="product.id" :product="product"/>
          </div>
          <div class="pagination">
            <button :disabled="page===1" @click="page--">‹</button>
            <button v-for="n in Math.min(result.pages,5)" :key="n" :class="{active:n===page}" @click="page=n">{{
                n
              }}
            </button>
            <button :disabled="page===result.pages" @click="page++">›</button>
          </div>
        </template>
        <div v-else class="empty-state"><h3>Ничего не найдено</h3>
          <p>Измените запрос или сбросьте фильтры.</p>
          <button class="button" @click="reset">Сбросить фильтры</button>
        </div>
      </div>
    </section>
  </main>
</template>
