import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    environmentOptions: {
      nuxt: {
        domEnvironment: 'jsdom',
      },
    },
    coverage: {
      include: [
        'components/**',
        'composables/**',
        'pages/**',
        'middleware/**',
        'stores/**',
      ],
      reportsDirectory: '../coverage',
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
      watermarks: {
        statements: [60, 80],
        functions: [60, 80],
        branches: [60, 80],
        lines: [60, 80],
      },
    },
    setupFiles: [
      'test-setup/clear-localstorage',
      'test-setup/setup-window-mocks',
    ],
  },
});
