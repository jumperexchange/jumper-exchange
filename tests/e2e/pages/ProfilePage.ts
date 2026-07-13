import { expect } from '@playwright/test';

import { JUMPER_BUTTONS } from '../data/urls';

import type { Locator, Page } from '@playwright/test';

export class ProfilePage {
  readonly achievementsTab: Locator;
  readonly noRecentTransactionsLabel: Locator;
  readonly perksCards: Locator;
  readonly perksCardsClaimButton: Locator;
  readonly perksCardsClaimedBadge: Locator;
  readonly perksClaimError: Locator;
  readonly perksTab: Locator;
  readonly startSwappingLink: Locator;
  readonly transactionHistoryButton: Locator;

  constructor(private readonly page: Page) {
    this.perksTab = page.locator('#profile-tabs-perks');
    this.achievementsTab = page.locator('#profile-tabs-achievements');
    this.perksCards = page.locator('[data-testid="perks-card"]');
    this.perksCardsClaimButton = this.perksCards
      .getByRole('button', { name: 'Claim' })
      .first();
    this.perksCardsClaimedBadge = page.getByTestId('perks-card-claimed-badge');
    this.perksClaimError = page.getByTestId('perks-claim-error');
    this.startSwappingLink = page.getByRole('link', { name: 'Start swapping' });
    this.transactionHistoryButton = page.getByLabel('Activities');
    this.noRecentTransactionsLabel = page.getByText('No recent transactions', {
      exact: true,
    });
  }

  async clickFirstPerkClaim(): Promise<void> {
    await this.perksCardsClaimButton.click();
  }

  async clickPassPrompt(): Promise<void> {
    // Pass is a Link to /profile; await the navigation so subsequent
    // assertions don't race the client-side route transition.
    await Promise.all([
      this.page.waitForURL(/\/profile(?:\/|$|\?|#)/),
      this.page.getByRole('button', { name: JUMPER_BUTTONS.PASS }).click(),
    ]);
  }

  async expectPerkClaimed(): Promise<void> {
    await expect(this.perksCardsClaimedBadge).toBeVisible();
  }

  async expectPerkClaimErrorOrIdle(): Promise<void> {
    // Post-rejection the UI either errors or stays unclaimed; both are fine. Assert no claimed badge appeared.
    await expect(this.perksCardsClaimedBadge).toBeHidden();
  }

  async expectPerksCards(): Promise<void> {
    // .count() is synchronous; poll until backend returns 2+ cards.
    await expect
      .poll(() => this.perksCards.count(), { timeout: 30_000 })
      .toBeGreaterThan(1);
  }

  async expectTransactionsPresent(): Promise<void> {
    await expect(this.noRecentTransactionsLabel).toBeHidden();
  }

  async expectVisible(): Promise<void> {
    // Anchor on Perks tab — `.profile-page` wrapper no longer rendered.
    await expect(this.perksTab).toBeVisible();
  }

  async openAchievementsTab(): Promise<void> {
    await this.achievementsTab.click();
  }

  async openPerksTab(): Promise<void> {
    await this.perksTab.click();
  }

  async openTransactionHistory(): Promise<void> {
    await this.transactionHistoryButton.click();
  }
}
