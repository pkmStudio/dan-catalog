<script setup lang="ts">
import { productResponseSchema } from '~/entities/product'
import { apiRequest, getProduct } from '~/shared/api'

const route = useRoute()
const { data, status } = await useAsyncData(`question-product-${route.params.id}`, () =>
  apiRequest(getProduct(String(route.params.id)), (value) => productResponseSchema.parse(value))
)
const product = computed(() => data.value?.data)
const success = ref(false),
  error = ref('')
const form = reactive({ name: '', phone: '', email: '', message: '', consent: false })

const getRequestErrorMessage = (requestError: unknown): string => {
  if (typeof requestError !== 'object' || requestError === null || !('data' in requestError)) {
    return 'Не удалось отправить вопрос'
  }

  const data = requestError.data
  if (typeof data !== 'object' || data === null || !('message' in data)) {
    return 'Не удалось отправить вопрос'
  }

  return typeof data.message === 'string' ? data.message : 'Не удалось отправить вопрос'
}

const submit = async () => {
  error.value = ''
  if (!form.consent) {
    error.value = 'Подтвердите согласие на обработку персональных данных'
    return
  }
  try {
    await $fetch('/api/questions', {
      method: 'POST',
      body: { ...form, productId: route.params.id }
    })
    success.value = true
  } catch (requestError: unknown) {
    error.value = getRequestErrorMessage(requestError)
  }
}
</script>
<template>
  <main>
    <LoadingState v-if="status === 'pending' || !product" />
    <section v-else-if="success" class="success-page">
      <i>✓</i>
      <h1>Вопрос отправлен</h1>
      <p>Специалист DAN проверит информацию и ответит в течение рабочего дня.</p>
      <NuxtLink class="button" :to="`/product/${route.params.id}`">Вернуться к товару</NuxtLink>
    </section>
    <section v-else class="question-page">
      <div class="question-heading">
        <small>Каталог / Щётки стеклоочистителя / {{ product.sku }} / Задать вопрос</small>
        <h1>Задать вопрос по товару</h1>
        <p>Специалист DAN проверит совместимость и ответит в течение рабочего дня.</p>
      </div>
      <div class="question-columns">
        <aside>
          <div class="question-product">
            <img :src="product.image" alt="" /><span
              ><small>{{ product.sku }}</small
              ><b>{{ product.name }}</b></span
            >
          </div>
          <div class="promise">
            <b>◷ Что проверит специалист</b><span>✓ Совместимость с автомобилем</span
            ><span>✓ Особенности установки</span><span>✓ Характеристики и аналоги</span>
          </div>
        </aside>
        <form class="question-form" @submit.prevent="submit">
          <h2>Контактные данные</h2>
          <div class="form-row">
            <label>Ваше имя *<input v-model="form.name" required placeholder="Введите имя" /></label
            ><label
              >Телефон *<input v-model="form.phone" required placeholder="+7 (___) ___-__-__"
            /></label>
          </div>
          <label
            >Email — необязательно<input
              v-model="form.email"
              type="email"
              placeholder="example@mail.ru" /></label
          ><label
            >Ваш вопрос *<textarea
              v-model="form.message"
              required
              placeholder="Например: подойдет ли эта щётка для Toyota Camry 2020 года?"
            /></label
          ><label class="consent"
            ><input v-model="form.consent" type="checkbox" />Согласен на обработку персональных
            данных</label
          >
          <div v-if="error" class="form-error">{{ error }}</div>
          <div class="form-actions">
            <small>Ответим в рабочее время: 9:00–20:00</small>
            <button class="button">Отправить вопрос</button>
          </div>
        </form>
      </div>
    </section>
  </main>
</template>
