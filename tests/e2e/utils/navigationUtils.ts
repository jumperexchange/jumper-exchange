import type { Page } from '@playwright/test';

/** Matches other e2e specs: domcontentloaded then wait for full load. */
export const gotoAndWaitForLoad = async (
  page: Page,
  path: string,
): Promise<void> => {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('load');
};
