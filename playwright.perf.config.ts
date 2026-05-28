import { defineConfig, devices } from '@playwright/test';

import baseConfig from './playwright.config';

/**
 * Production-like cold-load LCP benchmarks only.
 * Uses `pnpm build && pnpm start` locally (ISR / server cache) unless BASE_URL is set.
 */
export default defineConfig({
  ...baseConfig,
  testIgnore: undefined,
  testMatch: '**/performance/**/*.spec.ts',
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  retries: 0,
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'pnpm run build && pnpm run start',
        url: 'http://localhost:3000',
        timeout: 900 * 1000,
        reuseExistingServer: !process.env.CI,
      },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
