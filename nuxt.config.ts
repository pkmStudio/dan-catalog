export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxt/eslint'],
  css: ['~/shared/assets/css/tokens.css', '~/shared/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBase: '/api'
    }
  },
  typescript: {
    strict: true
  },
  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      title: 'DAN - Каталог',
      meta: [
        {
          name: 'description',
          content: 'Электронный каталог автозапчастей DAN'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'
        }
      ]
    }
  }
})
