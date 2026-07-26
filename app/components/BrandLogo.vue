<template>
  <NuxtLink to="/" class="brand" aria-label="DAN — главная">
    <img src="/dan-logo.png" alt="DAN">
  </NuxtLink>
</template>

<style scoped>
.brand {
  display: flex;
  width: 120px;
  height: 48px;
  flex: none;
  align-items: center
}

.brand img {
  display: block;
  width: 100%;
  height: auto
}

@media (max-width: 560px) {
  .brand {
    width: 105px;
    height: 40px
  }
}
</style>
