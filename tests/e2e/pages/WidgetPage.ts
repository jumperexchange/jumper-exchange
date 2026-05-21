import { expect } from '@playwright/test';

import type { Locator, Page } from '@playwright/test';

// LiFi widget has no `data-testid`s on the swap-execute path; anchor on
// role + accessible name (text derives from the widget's i18n bundle).
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
    await expect(this.swapSuccessfulTitle).toBeVisible({ timeout: timeoutMs });
  }
}
