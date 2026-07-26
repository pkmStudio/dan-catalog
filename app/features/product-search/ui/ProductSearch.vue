<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { ProductSearchResult, type ProductSummary } from '~/entities/product'
import { useProductSearchStore } from '../model'

const props = withDefaults(
  defineProps<{
    hero?: boolean
    surface: string
    resultMode?: 'dropdown' | 'region'
  }>(),
  {
    hero: false,
    resultMode: 'dropdown'
  }
)

const emit = defineEmits<{
  navigate: []
}>()

const store = useProductSearchStore()
const {
  activeSurface,
  errorMessage,
  highlightedIndex,
  isLoading,
  match,
  query,
  results,
  status,
  validationMessage
} = storeToRefs(store)

const root = ref<HTMLElement>()
const expanded = ref(false)
const inputId = useId()
const listboxId = useId()
const messageId = useId()

const isActive = computed(() => activeSurface.value === props.surface)
const showOutcome = computed(
  () =>
    isActive.value &&
    expanded.value &&
    (isLoading.value ||
      status.value === 'error' ||
      status.value === 'empty' ||
      results.value.length > 0)
)
const activeDescendant = computed(() => {
  const product = results.value[highlightedIndex.value]
  return product ? `${listboxId}-${product.id}` : undefined
})
const placeholder = computed(() =>
  props.hero ? 'Введите артикул или название детали...' : 'Поиск по артикулу или названию...'
)

const updateQuery = (event: Event) => {
  const target = event.target
  if (!(target instanceof HTMLInputElement)) return

  expanded.value = true
  store.updateQuery(target.value, props.surface)
}

const navigateToProduct = async (product: ProductSummary) => {
  expanded.value = false
  emit('navigate')
  await navigateTo(`/product/${encodeURIComponent(product.id)}`)
}

const submit = async () => {
  expanded.value = true
  const response = await store.submitSearch(props.surface)
  if (!response) return

  const exactProduct = response.data.match === 'exact' ? response.data.items[0] : undefined
  if (exactProduct) {
    await navigateToProduct(exactProduct)
    return
  }

  emit('navigate')
  await navigateTo({ path: '/', query: { q: store.query } })
}

const retry = async () => {
  expanded.value = true
  await store.retrySearch(props.surface)
}

const handleKeydown = async (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    expanded.value = false
    return
  }

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    expanded.value = true
    store.moveHighlight(event.key === 'ArrowDown' ? 1 : -1)
    return
  }

  if (event.key === 'Enter' && highlightedIndex.value >= 0) {
    const product = results.value[highlightedIndex.value]
    if (!product) return
    event.preventDefault()
    await navigateToProduct(product)
  }
}

const handleFocusOut = (event: FocusEvent) => {
  const nextTarget = event.relatedTarget
  if (nextTarget instanceof Node && root.value?.contains(nextTarget)) return
  expanded.value = false
}

const handleFocus = () => {
  expanded.value = true
  store.activateSurface(props.surface)
}

const highlightResult = (index: number) => {
  store.highlightedIndex = index
}

watch(
  [status, activeSurface],
  ([nextStatus, nextSurface]) => {
    if (nextSurface === props.surface && nextStatus !== 'idle') {
      expanded.value = true
    }
  },
  { immediate: true }
)
</script>

<template>
  <div
    ref="root"
    class="product-search"
    :class="`product-search--${resultMode}`"
    :data-hero="hero || undefined"
    @focusout="handleFocusOut"
  >
    <form class="product-search__form" role="search" @submit.prevent="submit">
      <div class="product-search__field">
        <label class="visually-hidden" :for="inputId">Поиск товара</label>
        <span class="product-search__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </span>
        <input
          :id="inputId"
          :value="query"
          type="search"
          autocomplete="off"
          :placeholder="placeholder"
          role="combobox"
          aria-autocomplete="list"
          :aria-expanded="showOutcome"
          :aria-controls="listboxId"
          :aria-activedescendant="activeDescendant"
          :aria-describedby="validationMessage ? messageId : undefined"
          :aria-invalid="Boolean(validationMessage)"
          @input="updateQuery"
          @focus="handleFocus"
          @keydown="handleKeydown"
        />
        <span v-if="isActive && isLoading" class="product-search__spinner" aria-hidden="true" />
      </div>
      <button v-if="hero" class="product-search__submit" type="submit" :disabled="isLoading">
        Найти
      </button>
    </form>

    <p v-if="isActive && validationMessage" :id="messageId" class="product-search__validation">
      {{ validationMessage }}
    </p>

    <section
      v-if="showOutcome"
      class="product-search__outcome"
      :class="{ 'product-search__outcome--region': resultMode === 'region' }"
      aria-live="polite"
    >
      <p v-if="isLoading" class="product-search__message" role="status">Ищем товары…</p>

      <div v-else-if="status === 'error'" class="product-search__message" role="alert">
        <span class="product-search__message-row">
          <svg
            class="product-search__message-icon product-search__message-icon--error"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M5 12.6A7 7 0 0 1 16.8 7.5M19 12a7 7 0 0 1-11.8 5.1M3 3l18 18" />
          </svg>
          <span class="product-search__message-copy">
            <strong>Ошибка сети</strong>
            <span>{{ errorMessage }}</span>
          </span>
        </span>
        <button type="button" @click="retry">Повторить поиск</button>
      </div>

      <div v-else-if="status === 'empty'" class="product-search__message">
        <span class="product-search__message-row">
          <svg class="product-search__message-icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m15.5 15.5 5 5M8 8l5 5M13 8l-5 5" />
          </svg>
          <span class="product-search__message-copy">
            <strong>Ничего не найдено</strong>
            <span>Проверьте артикул или попробуйте другое название.</span>
          </span>
        </span>
        <NuxtLink to="/catalog">Перейти в каталог</NuxtLink>
      </div>

      <template v-else-if="results.length">
        <p class="visually-hidden" role="status">
          {{
            match === 'exact' ? 'Найдено точное совпадение' : `Найдено товаров: ${results.length}`
          }}
        </p>
        <ul
          :id="listboxId"
          class="product-search__results"
          role="listbox"
          aria-label="Результаты поиска"
        >
          <ProductSearchResult
            v-for="(product, index) in results"
            :key="product.id"
            :product="product"
            :option-id="`${listboxId}-${product.id}`"
            :active="highlightedIndex === index"
            @highlight="highlightResult(index)"
            @select="navigateToProduct"
          />
        </ul>
      </template>
    </section>
  </div>
</template>

<style scoped>
.product-search {
  position: relative;
  inline-size: 100%;
}

.product-search__form {
  min-block-size: 44px;
  display: flex;
}

.product-search__field {
  min-inline-size: 0;
  min-block-size: 44px;
  padding-inline: 14px;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
  display: flex;
  flex: 1;
  align-items: center;
  gap: 10px;
}

.product-search__field:focus-within {
  border-color: var(--brand-orange);
  box-shadow: var(--focus-ring);
}

.product-search__icon {
  inline-size: 18px;
  block-size: 18px;
  color: var(--text-muted);
  flex: none;
}

.product-search__icon svg {
  inline-size: 100%;
  block-size: 100%;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
}

.product-search input {
  inline-size: 100%;
  min-inline-size: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--text-primary);
  font: inherit;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
}

.product-search input::-webkit-search-cancel-button {
  cursor: pointer;
}

.product-search input:focus-visible {
  outline: none;
  box-shadow: none;
}

.product-search__spinner {
  inline-size: 18px;
  block-size: 18px;
  border: 2px solid var(--border-medium);
  border-block-start-color: var(--brand-orange);
  border-radius: 50%;
  flex: none;
  animation: spin 0.8s linear infinite;
}

.product-search__submit {
  min-inline-size: 140px;
  border: 0;
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
  background: var(--brand-orange);
  color: var(--text-inverse);
  font: inherit;
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
}

.product-search__submit:hover {
  background: var(--brand-orange-dark);
}

.product-search__submit:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

.product-search__submit:disabled {
  cursor: wait;
  opacity: 0.7;
}

.product-search__validation {
  margin: var(--spacing-xs) 0 0;
  color: var(--error);
  font-size: var(--font-size-sm);
  text-align: start;
}

.product-search__outcome {
  position: absolute;
  z-index: 50;
  inset-block-start: calc(100% + var(--spacing-sm));
  inset-inline: 0;
  max-block-size: 326px;
  padding: var(--spacing-sm);
  overflow: auto;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  background: var(--bg-primary);
  box-shadow: var(--shadow-md);
}

.product-search__outcome--region {
  position: relative;
  inset-block-start: auto;
  margin-block-start: var(--spacing-md);
  text-align: start;
}

.product-search__results {
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.product-search__message {
  min-block-size: 118px;
  margin: 0;
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  gap: var(--spacing-sm);
  color: var(--text-secondary);
}

.product-search__message-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-search__message-icon {
  inline-size: 22px;
  block-size: 22px;
  fill: none;
  stroke: var(--text-muted);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
  flex: none;
}

.product-search__message-icon--error {
  stroke: var(--error);
}

.product-search__message-copy {
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.product-search__message-copy strong {
  color: var(--text-primary);
  font-size: 15px;
}

.product-search__message button,
.product-search__message a {
  min-block-size: 38px;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 0;
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
  color: var(--brand-orange);
  font: inherit;
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  cursor: pointer;
}

.product-search[data-hero='true'] {
  inline-size: min(100%, 640px);
}

.product-search[data-hero='true'] .product-search__field {
  min-block-size: 56px;
  padding-inline-start: 20px;
  border-color: var(--border-light);
  border-radius: var(--radius-lg) 0 0 var(--radius-lg);
  background: var(--bg-primary);
}

.product-search[data-hero='true'] input {
  font-size: var(--font-size-lg);
}

@keyframes spin {
  to {
    transform: rotate(1turn);
  }
}

@media (max-width: 700px) {
  .product-search[data-hero='true'] .product-search__form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .product-search[data-hero='true'] .product-search__field {
    inline-size: 100%;
    min-block-size: 52px;
    padding: 0;
    border: 1px solid var(--border-light);
    border-radius: 10px;
    background: var(--bg-primary);
  }

  .product-search[data-hero='true'] .product-search__icon {
    position: relative;
    inset-inline-start: 14px;
  }

  .product-search[data-hero='true'] input {
    block-size: 50px;
    padding: 0 14px 0 22px;
    font-size: var(--font-size-md);
  }

  .product-search[data-hero='true'] .product-search__spinner {
    margin-inline-end: 14px;
  }

  .product-search__submit {
    inline-size: 100%;
    block-size: 52px;
    border-radius: 10px;
  }

  .product-search__outcome {
    position: relative;
    inset-block-start: auto;
    max-block-size: min(330px, 60vh);
    margin-block-start: var(--spacing-sm);
    padding: 6px;
    border-radius: 10px;
  }

  .product-search__message {
    min-block-size: 126px;
    padding: 14px;
  }

  .product-search__message-copy strong {
    font-size: 14px;
  }

  .product-search__message-copy span {
    font-size: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .product-search__spinner {
    animation: none;
  }
}
</style>
