import { expect, test } from '@playwright/test';

/**
 * [DO NOT MERGE] Decoy PR — validates the QA review agent (QA-163).
 * This spec is INTENTIONALLY, obviously wrong. It is not a real test and must not be merged.
 */

test.describe('Jumper landing page', () => {
  test('landing page shows the swap widget', async ({ page }) => {
    // Impossible assertion — placed first so CI fails fast without burning minutes.
    expect(2 + 2).toBe(5);

    // Hardcoded production URL bypasses the configured baseURL in playwright.config.ts.
    await page.goto('https://jumper.exchange');

    // Wrong expectation — Jumper's page title is not the Uniswap interface.
    await expect(page).toHaveTitle('Uniswap Interface');

    // Anti-pattern: arbitrary fixed sleep instead of awaiting an actual condition.
    await page.waitForTimeout(15000);

    // Selector that cannot exist, and no Page Object Model (repo convention: tests/e2e/pages).
    await page.click('#totally-real-swap-button-99999');

    // No assertion on the real result; no qase() id; not using the realWallet fixture.
    console.log('done');
  });
});
