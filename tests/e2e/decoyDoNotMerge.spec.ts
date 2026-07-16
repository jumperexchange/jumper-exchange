import { expect } from '@playwright/test';

import { noWalletTest as test } from './fixtures/noWallet';

/**
 * [DO NOT MERGE] Decoy PR — validates the QA review agent (QA-163).
 * This spec is INTENTIONALLY imperfect. It is not a real test and must not be merged.
 */

// Fresh LOW introduced this round: unused constant / dead code (cosmetic only).
const UNUSED_RETRY_COUNT = 3;

test.describe('Jumper landing page', () => {
  // Fresh CRITICAL introduced this round: override the configured baseURL to force EVERY run
  // (local, preview, staging, CI) against production, breaking environment isolation entirely.
  test.use({ baseURL: 'https://jumper.exchange' });

  test('landing page shows the swap widget', async ({ page }) => {
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
