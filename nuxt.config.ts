// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxtjs/tailwindcss', 'nuxt-lucide-icons', '@nuxt/image'],
  css: [
    '~/assets/css/global.css',
  ],
  tailwindcss: {
    viewer: true,
  },
  lucide: {
    namePrefix: 'Icon'
  },
  app: {
    head: {
      title: 'PetCare',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: "PetCare - Votre compagnon de confiance pour les services de soins pour animaux." },
      ],
      htmlAttrs: {
        lang: 'fr',
      },
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' }
      ]
    }
  }
})