import type { Page } from '@playwright/test';

// Mirrors the zustand persist config in src/stores/settings/createSettingsStore.tsx.
const SETTINGS_STORE_KEY = 'jumper-store';
const SETTINGS_STORE_VERSION = 4;

/**
 * Seeds the persisted settings store so the welcome overlay never mounts.
 * Dismissing it by clicking races React hydration under CI load (a single
 * missed "Get Started" click leaves the overlay up); pre-seeding removes the
 * interaction entirely. Call before the test's first goto().
 */
export async function seedWelcomeScreenClosed(page: Page): Promise<void> {
  await page.addInitScript(
    ({ key, version }) => {
      const existing = JSON.parse(
        globalThis.localStorage.getItem(key) ?? 'null',
      );
      globalThis.localStorage.setItem(
        key,
        JSON.stringify({
          version,
          ...existing,
          state: { ...existing?.state, welcomeScreenClosed: true },
        }),
      );
    },
    { key: SETTINGS_STORE_KEY, version: SETTINGS_STORE_VERSION },
  );
}
