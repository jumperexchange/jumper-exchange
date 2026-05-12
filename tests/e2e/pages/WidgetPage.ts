import { expect } from '@playwright/test';

import type { Locator, Page } from '@playwright/test';

// The LiFi widget (rendered inside Jumper) has near-zero `data-testid`
// coverage on the swap-execute path. We anchor on role + accessible name,
// which derives from the widget's i18n bundle. Labels for English:
//   - `button.swapReview`     → "Review swap"      (main page CTA)
//   - `button.bridgeReview`   → "Review bridge"    (same, cross-chain)
//   - `button.startSwapping`  → "Start swapping"   (transaction page CTA)
//   - `button.startBridging`  → "Start bridging"   (same, cross-chain)
//   - `success.title.swapSuccessful` → "Swap successful"
//   - `success.title.bridgeSuccessful` → "Bridge successful"
//
// If the widget's i18n keys ever change OR Jumper overrides them, update
// here (or push for `data-testid`s on the widget side — JUM-924-adjacent).
export class WidgetPage {
  readonly reviewSwapButton: Locator;
  readonly startSwappingButton: Locator;
  readonly swapSuccessfulTitle: Locator;

  constructor(private readonly page: Page) {
    this.reviewSwapButton = page.getByRole('button', { name: 'Review swap' });
    this.startSwappingButton = page.getByRole('button', {
      name: 'Start swapping',
    });
    this.swapSuccessfulTitle = page.getByText('Swap successful', {
      exact: true,
    });
  }

  async clickReviewSwap(): Promise<void> {
    await expect(this.reviewSwapButton).toBeVisible();
    await this.reviewSwapButton.click();
  }

  async clickStartSwapping(): Promise<void> {
    await expect(this.startSwappingButton).toBeVisible();
    await this.startSwappingButton.click();
  }

  async expectSwapSuccessful(timeoutMs: number): Promise<void> {
    // On-chain settle on Arbitrum is fast (1-3s) but LiFi pipeline + UI
    // updates can drift. Caller picks the timeout based on chain.
    await expect(this.swapSuccessfulTitle).toBeVisible({ timeout: timeoutMs });
  }
}
