import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
/**
 * See https://playwright.dev/docs/test-configuration.
 */

dotenv.config({ path: './tests/.env.test' });
// Per-developer overrides (gitignored via the `.env*` rule). Loaded second
// with `override: true` so local values (wallet seed, password) win over
// the committed shared defaults — Next.js convention. See tests/README.md
// § Required env.
dotenv.config({ path: './tests/.env.test.local', override: true });

// Use process.env.PORT by default and fallback to port 3000
// const PORT = process.env.PORT || 3000;

// Set webServer.url and use.baseURL with the location of the WebServer respecting the correct set port
// const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  timeout: 120 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  // Cold-load LCP benchmarks live under tests/performance/ — run via
  // `pnpm test:perf:cold-lcp` (playwright.perf.config.ts), not the CI e2e gate.
  testIgnore: ['**/performance/**'],
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI
    ? [['list'], ['blob']]
    : [
        ['list'],
        ['html'],
      ] /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */,
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: process.env.BASE_URL
    ? undefined
    : {
        // Serve a prod build under CI/E2E_PROD_BUILD — the Turbopack dev server
        // intermittently boot-hangs on CI runners (300s webServer timeout).
        // E2E_SKIP_BUILD serves a prebuilt .next handed over by the CI build job:
        // the build prerenders against live Strapi/backend, so every extra build
        // is another chance for a transient upstream blip to kill the run.
        command: process.env.E2E_SKIP_BUILD
          ? 'pnpm run start'
          : process.env.E2E_PROD_BUILD || process.env.CI
            ? 'pnpm run build && pnpm run start'
            : 'pnpm run dev',
        url: 'http://localhost:3000',
        timeout:
          (process.env.E2E_SKIP_BUILD
            ? 120
            : process.env.E2E_PROD_BUILD || process.env.CI
              ? 900
              : 300) * 1000,
        reuseExistingServer: !process.env.CI,
      },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    //
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
});
