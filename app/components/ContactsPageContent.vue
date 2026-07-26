<script setup lang="ts">
const route = useRoute()
const requestNumber = computed(() => {
  const request = route.query.request
  return typeof request === 'string' && request ? request : null
})
</script>

<template>
  <ContactSuccess v-if="requestNumber" :request-number="requestNumber"/>
  <template v-else>
    <PageHero
      title="Свяжитесь с нами"
      subtitle="Поможем подобрать запчасть и ответим на вопросы о продукции DAN."
      :crumbs="[{label:'Контакты'}]"
    />
    <section class="contacts">
      <ContactInfo/>
      <ContactForm/>
    </section>
  </template>
</template>
