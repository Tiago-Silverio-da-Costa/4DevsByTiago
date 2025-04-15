// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxt/image', '@nuxt/icon', '@nuxtjs/sitemap', '@nuxtjs/robots'],
  // sitemap: {
  //   hostname: 'https://4devsbytiagosc.com',
  //   routes: async () => {
  //     const runtimeConfig = useRuntimeConfig()
  //     const response = await axios.get(`${runtimeConfig.public.apiBase}/posts`);
  //     const posts = response.data.data;
  //     return posts.map(post => `/post/${post.slug}`);
  //   }
  // },
  // robots: {
  //   : [
  //     {
  //       UserAgent: '*',
  //       Disallow: '/admin',
  //     }
  //   ],

  //   sitemap: 'https://4devsbytiagosc.com/sitemap.xml'
  // },
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