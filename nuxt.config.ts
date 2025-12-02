// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    'nuxt-lucide-icons'
  ],
  css: [
    '~/assets/css/global.css',
  ],
  tailwindcss: {
    viewer: true, // ouvre un viewer pour explorer les classes disponibles
  },
  lucide: {
    namePrefix: 'Icon'
  }
})