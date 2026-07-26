<script setup lang="ts">
import type { ApiResponse, Product } from '~/types/catalog'

withDefaults(defineProps<{ hero?: boolean; compact?: boolean }>(), {
  hero: false,
  compact: false
})
const emit = defineEmits<{ navigate: [] }>()
const query = ref('')
const open = ref(false)
const error = ref('')
const loading = ref(false)
const results = ref<Product[]>([])
let timer: ReturnType<typeof setTimeout> | undefined
watch(query, (value) => {
  clearTimeout(timer)
  error.value = ''
  if (value.trim().length < 2) {
    results.value = []
    return
  }
  timer = setTimeout(async () => {
    loading.value = true
    try {
      const r = await $fetch<ApiResponse<{ items: Product[] }>>('/api/search', {
        query: { q: value }
      })
      results.value = r.data.items
      open.value = true
    } catch {
      error.value = 'Не удалось выполнить поиск'
    } finally {
      loading.value = false
    }
  }, 280)
})
const submit = async () => {
  if (!query.value.trim()) {
    error.value = 'Введите артикул или название'
    open.value = true
    return
  }
  loading.value = true
  try {
    const r = await $fetch<ApiResponse<{ match: string; items: Product[] }>>('/api/search', {
      query: { q: query.value }
    })
    if (r.data.match === 'exact') await navigateTo(`/product/${r.data.items[0]!.id}`)
    else await navigateTo(`/category/wipers?q=${encodeURIComponent(query.value)}`)
    open.value = false
    emit('navigate')
  } catch {
    error.value = 'Не удалось выполнить поиск'
    open.value = true
  } finally {
    loading.value = false
  }
}
const pick = async (item: Product) => {
  open.value = false
  emit('navigate')
  await navigateTo(`/product/${item.id}`)
}
</script>
<template>
  <div class="search-shell" :class="{ 'is-hero': hero }">
    <form class="search-box" @submit.prevent="submit">
      <svg viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        v-model="query"
        aria-label="Поиск"
        placeholder="Поиск по артикулу, OEM, названию..."
        @focus="open = true"
      /><span v-if="loading" class="spinner" />
      <button v-if="hero" type="submit">Найти</button>
    </form>
    <div v-if="open && (error || results.length)" class="search-dropdown">
      <div v-if="error" class="search-message">⚠ {{ error }}</div>
      <button v-for="item in results" v-else :key="item.id" @click="pick(item)">
        <img :src="item.image" alt="" /><span
          ><b>{{ item.sku }}</b
          ><small>{{ item.name }}</small></span
        ><i>›</i>
      </button>
    </div>
  </div>
</template>
