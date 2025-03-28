// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/test-utils/module',
    '@nuxthub/core',
    '@nuxt/devtools',
    '@pinia/nuxt',
    '@vee-validate/nuxt',
  ],
  ssr: false,
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  devtools: { enabled: true },
  app: {
    head: {
      bodyAttrs: {
        class: 'n-margin-i-none n-margin-b-none',
      },
    },
  },
  vue: {
    compilerOptions: {
      // treat all tags with a dash as custom elements
      isCustomElement: (tag: string) => tag.includes('-'),
    },
  },
  compatibilityDate: '2024-11-01',
  hub: {
    database: true,
  },
  typescript: {
    typeCheck: true,
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
});
