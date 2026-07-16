import {
  SETTINGS_PERSIST_KEY,
  SETTINGS_PERSIST_VERSION,
} from '../../../src/stores/settings/persistConfig';

import type { Page } from '@playwright/test';

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
    { key: SETTINGS_PERSIST_KEY, version: SETTINGS_PERSIST_VERSION },
  );
}
