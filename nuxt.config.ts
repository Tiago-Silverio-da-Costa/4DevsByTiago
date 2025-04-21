// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxt/image', '@nuxt/icon', '@nuxtjs/sitemap', '@nuxtjs/robots'],
  build: {
    transpile: ['vue-toastification'],
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_BASE_URL_PRINCIPAL
    },
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  nitro: {
    logLevel: 'debug',
  },
  app: {
    head: {
      title: '4devsbyTiagoSC - Blog para Desenvolvedores',
      htmlAttrs: {
        lang: 'en',
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ]
    }
  }
})