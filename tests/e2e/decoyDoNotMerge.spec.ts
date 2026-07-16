import { expect } from '@playwright/test';

import { noWalletTest as test } from './fixtures/noWallet';

/**
 * [DO NOT MERGE] Decoy PR — validates the QA review agent (QA-163).
 * This spec is INTENTIONALLY imperfect. It is not a real test and must not be merged.
 */

test.describe('Jumper landing page', () => {
  test('landing page shows the swap widget', async ({ page }) => {
    // Critical fixes applied: relative navigation (respects baseURL) + correct title assertion.
    await page.goto('/');

    await expect(page).toHaveTitle(/Jumper/);

    // Anti-pattern: arbitrary fixed sleep instead of awaiting an actual condition.
    await page.waitForTimeout(15000);

    // Selector that cannot exist, and no Page Object Model (repo convention: tests/e2e/pages).
    await page.click('#totally-real-swap-button-99999');

    // No assertion on the real result; no qase() id.
    console.log('done');
  });
});
