<script setup lang="ts">
const { form, error, submitting, phoneError, onNameInput, onPhoneInput, touchPhone, submit } =
  useContactForm()
</script>

<template>
  <form class="contact-form" @submit.prevent="submit">
    <h2>Напишите нам</h2>
    <p>Оставьте контакты — специалист DAN свяжется с вами.</p>
    <div class="form-row">
      <label>
        Ваше имя
        <input
          :value="form.name"
          type="text"
          inputmode="text"
          autocomplete="name"
          required
          maxlength="32"
          placeholder="Иван"
          @input="onNameInput"
        />
        <small class="field-hint">{{ form.name.length }}/32</small>
      </label>
      <label>
        Телефон
        <input
          :value="form.phone"
          type="tel"
          inputmode="numeric"
          autocomplete="tel"
          maxlength="18"
          required
          placeholder="+7 (___) ___-__-__"
          :class="{ 'input-error': phoneError }"
          @input="onPhoneInput"
          @blur="touchPhone"
        />
        <small v-if="phoneError" class="field-error">{{ phoneError }}</small>
      </label>
    </div>
    <label>
      Сообщение
      <textarea
        v-model="form.message"
        required
        placeholder="Опишите вопрос или укажите артикул детали..."
      />
    </label>
    <div v-if="error" class="form-error">{{ error }}</div>
    <button class="button" :disabled="submitting">
      <svg v-if="!submitting" class="button-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
      </svg>
      {{ submitting ? 'Отправляем…' : 'Отправить сообщение' }}
    </button>
  </form>
</template>

<style scoped>
.contact-form label {
  font-size: 14px;
}

.field-hint {
  align-self: flex-end;
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 400;
}

.field-error {
  color: #9b280b;
  font-size: 11px;
  font-weight: 500;
}

.contact-form input.input-error {
  border-color: #d93c15;
}

.button-icon {
  width: 18px;
  height: 18px;
  flex: none;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
