<template>
  <footer id="contacts" class="footer">
    <p>© 2024 DAN Auto Parts. Все права защищены.</p>
    <div><a href="tel:+78005553535">+7 (800) 555-35-35</a><a href="mailto:info@dan-parts.ru">info@dan-parts.ru</a></div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: auto;
  padding: 32px 48px;
  background: var(--black);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px
}

.footer div {
  display: flex;
  gap: 24px
}

@media (max-width: 650px) {
  .footer {
    padding: 26px 20px;
    align-items: flex-start;
    gap: 18px;
    flex-direction: column
  }

  .footer div {
    flex-direction: column;
    gap: 8px
  }
}
</style>
