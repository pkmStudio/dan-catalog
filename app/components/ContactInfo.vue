<script setup lang="ts">
import { Mail, MapPin, Phone } from '@lucide/vue'
</script>

<template>
  <div class="contact-info">
    <h2>Контактная информация</h2>
    <div class="contact-row">
      <i>
        <Phone :size="20" />
      </i>
      <p><small>Телефон</small><b>+7 (800) 555-35-35</b><em>Бесплатно по России</em></p>
    </div>
    <div class="contact-row">
      <i>
        <Mail :size="20" />
      </i>
      <p>
        <small>Электронная почта</small><b>info@dan-parts.ru</b
        ><em>Ответим в течение рабочего дня</em>
      </p>
    </div>
    <div class="contact-row">
      <i>
        <MapPin :size="20" />
      </i>
      <p><small>Офис</small><b>Москва, ул. Автозаводская, 23</b><em>Пн–Пт, 09:00–18:00</em></p>
    </div>
    <div class="support-note">
      <b>Нужен быстрый ответ?</b>
      <span>Подготовьте артикул или VIN автомобиля — так мы поможем быстрее.</span>
    </div>
  </div>
</template>
