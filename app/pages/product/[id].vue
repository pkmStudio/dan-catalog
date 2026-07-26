<script setup lang="ts">
import { CarFront, MessageCircle } from '@lucide/vue'
import type { ApiResponse, Product } from '~/types/catalog'

const route = useRoute()
const vehicle = useVehicleState()
const { data, status, error, refresh } = await useFetch<ApiResponse<Product>>(
  `/api/products/${route.params.id}`
)
const product = computed(() => data.value?.data)
const selected = ref(0)
const tab = ref<'applications' | 'oem' | 'analogs'>('applications')
const tabData = computed(() => product.value?.[tab.value] || [])
</script>
<template>
  <main>
    <LoadingState
      v-if="status === 'pending' || error || !product"
      :error="error?.message"
      @retry="refresh"
    />
    <template v-else>
      <PageHero
        title="Щетки стеклоочистителя"
        subtitle="Характеристики, применяемость и OEM-информация"
        :crumbs="[
          { label: 'Каталог', to: '/catalog' },
          { label: 'Щетки', to: '/category/wipers' },
          { label: product.sku }
        ]"
      />
      <section class="product-detail">
        <div class="gallery">
          <img
            class="gallery-main"
            :src="product.images[selected] || product.image"
            :alt="product.name"
          />
          <div class="thumbnails">
            <button
              v-for="(image, i) in product.images"
              :key="image"
              :class="{ active: i === selected }"
              @click="selected = i"
            >
              <img :src="image" alt="" />
            </button>
          </div>
        </div>
        <div class="product-info">
          <div class="sku">
            Артикул: <b>{{ product.sku }}</b>
          </div>
          <h1>{{ product.name }}</h1>
          <div class="compatibility" :class="vehicle ? 'compatible' : 'incompatible'">
            <i>{{ vehicle ? '✓' : '×' }}</i
            ><span
              ><b>{{ vehicle ? 'Подходит для вашего автомобиля' : 'Автомобиль не выбран' }}</b
              ><small>{{
                vehicle
                  ? `${vehicle.makeName} ${vehicle.modelName} · ${vehicle.modification}`
                  : 'Выберите автомобиль для проверки совместимости'
              }}</small></span
            >
            <NuxtLink to="/vehicle">{{ vehicle ? 'Изменить' : 'Выбрать' }}</NuxtLink>
          </div>
          <div class="product-actions">
            <NuxtLink class="button" to="/vehicle">
              <CarFront :size="18" :stroke-width="2" aria-hidden="true" />
              <span>Проверить совместимость</span>
            </NuxtLink>
            <NuxtLink class="button secondary orange" :to="`/product/${product.id}/question`">
              <MessageCircle :size="18" :stroke-width="2" aria-hidden="true" />
              <span>Задать вопрос</span>
            </NuxtLink>
          </div>
          <p class="description">{{ product.description }}</p>
          <div class="specs">
            <h3>Характеристики</h3>
            <div
              v-for="row in [
                ['Длина', `${product.length} мм`],
                ['Тип', product.type],
                ['Крепление', product.mount],
                ['Материал резинки', product.material],
                ['Гарантия', product.warranty]
              ]"
              :key="row[0]"
            >
              <span>{{ row[0] }}</span
              ><b>{{ row[1] }}</b>
            </div>
          </div>
          <div class="tabs">
            <div class="tab-buttons">
              <button :class="{ active: tab === 'applications' }" @click="tab = 'applications'">
                Применяемость
              </button>
              <button :class="{ active: tab === 'oem' }" @click="tab = 'oem'">OEM номера</button>
              <button :class="{ active: tab === 'analogs' }" @click="tab = 'analogs'">
                Аналоги
              </button>
            </div>
            <div class="tab-content">
              <b>{{
                tab === 'applications'
                  ? 'Подходит для моделей'
                  : tab === 'oem'
                    ? 'Оригинальные номера'
                    : 'Совместимые аналоги'
              }}</b
              ><span v-for="item in tabData" :key="item">{{ item }}</span>
            </div>
          </div>
          <div class="question-callout">
            <MessageCircle
              class="question-callout__icon"
              :size="20"
              :stroke-width="2"
              aria-hidden="true"
            />
            <div>
              <b>Есть вопрос по товару?</b>
              <p>Оставьте заявку и наши специалисты свяжутся с вами</p>
            </div>
            <NuxtLink class="button" :to="`/product/${product.id}/question`"
              >Задать вопрос</NuxtLink
            >
          </div>
        </div>
      </section>
    </template>
  </main>
</template>
