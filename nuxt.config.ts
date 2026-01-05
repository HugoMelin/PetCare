// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "@nuxtjs/tailwindcss",
    "nuxt-lucide-icons",
    "@nuxt/image",
    "@vite-pwa/nuxt",
    "@pinia/nuxt",
  ],
  css: ["~/assets/css/global.css"],
  tailwindcss: {
    viewer: true,
  },
  lucide: {
    namePrefix: "Icon",
  },
  pinia: {
    storesDirs: ["./stores/**"],
  },
  app: {
    head: {
      title: "PetCare",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "PetCare - Votre compagnon de confiance pour les services de soins pour animaux.",
        },
      ],
      htmlAttrs: {
        lang: "fr",
      },
      link: [
        { rel: "icon", type: "image/png", href: "/favicon.png" },
        { rel: "manifest", href: "/manifest.webmanifest" },
      ],
    },
  },
  pwa: {
    registerType: "autoUpdate",
    devOptions: {
      enabled: true,
      type: "module",
    },
    manifest: {
      name: "PetCare",
      short_name: "PetCare",
      description:
        "Votre compagnon de confiance pour les services de soins pour animaux.",
      lang: "fr",
      start_url: "/",
      scope: "/",
      theme_color: "#ffffff",
      background_color: "#FFFFFF",
      display: "standalone",
      icons: [
        {
          src: "/pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    workbox: {},
  },
});
