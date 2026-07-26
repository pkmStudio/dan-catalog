<template>
  <footer id="contacts" class="footer">
    <p>© 2024 DAN Auto Parts. Все права защищены.</p>
    <div>
      <a href="tel:+78005553535">+7 (800) 555-35-35</a>
      <a href="mailto:info@dan-parts.ru">info@dan-parts.ru</a>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding: var(--spacing-xl) var(--spacing-2xl);
  background: var(--bg-dark);
  color: var(--text-inverse);
  font-size: var(--font-size-md);
}

.footer div {
  display: flex;
  gap: var(--spacing-lg);
}

@media (max-width: 650px) {
  .footer {
    align-items: flex-start;
    gap: 18px;
    flex-direction: column;
    padding: 26px 20px;
  }

  .footer div {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
}
</style>
