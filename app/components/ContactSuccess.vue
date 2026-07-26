<script setup lang="ts">
import { Check } from '@lucide/vue'

defineProps<{ requestNumber: string }>()
</script>

<template>
  <section class="contact-success">
    <div class="contact-success-card">
      <span class="contact-success-icon"><Check :size="32" /></span>
      <h1>Сообщение отправлено</h1>
      <p>Специалист DAN изучит ваше обращение и свяжется с вами в рабочее время.</p>
      <span class="request-number">Обращение № {{ requestNumber }}</span>
      <div class="contact-success-action">
        <span>
          <small>Служба поддержки DAN</small>
          <b>Ответим в течение рабочего дня</b>
        </span>
        <NuxtLink to="/contacts">Вернуться к контактам</NuxtLink>
      </div>
    </div>
  </section>
</template>
