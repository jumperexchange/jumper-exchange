import { expect } from '@playwright/test';

import type { Locator, Page } from '@playwright/test';

export class ScanPage {
  readonly latestTransfersHeading: Locator;
  readonly transactionLinks: Locator;
  readonly transferHeading: Locator;

  constructor(private readonly page: Page) {
    // Labels are <p>, not <h*>; getByText matches either if the app later wraps in a heading.
    this.latestTransfersHeading = page.getByText('Latest transfers', {
      exact: true,
    });
    // Rows render inside @lifi/explorer — no app element to tag.
    this.transactionLinks = page.locator('a[href^="/scan/tx/"]');
    this.transferHeading = page.getByText('Transfer', { exact: true }).first();
  }

  async clickFirstTransaction(): Promise<void> {
    await this.clickTransactionEntry(0);
  }

  async clickTransactionEntry(index: number): Promise<void> {
    await expect(this.latestTransfersHeading).toBeVisible();
    await expect(this.transactionLinks.first()).toBeVisible();
    await this.transactionLinks.nth(index).click();
  }

  async expectOnTransactionPage(): Promise<void> {
    await this.page.waitForURL(/\/tx\//);
    await expect(this.page).toHaveURL(/\/tx\//);
    await expect(this.transferHeading).toBeVisible();
  }
}
