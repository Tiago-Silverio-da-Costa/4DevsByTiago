// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  build: {
    // vue-toastification - old commonjs module 
    transpile: ['vue-toastification'],
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_BASE_URL_PRINCIPAL
    },
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/image', '@nuxt/icon'],
  nitro: {
    logLevel: 'debug',
  },

})