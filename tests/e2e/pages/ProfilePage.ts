import { expect } from '@playwright/test';

import { JUMPER_BUTTONS } from '../data';

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
    await this.page.getByRole('button', { name: JUMPER_BUTTONS.PASS }).click();
  }

  async expectPerkClaimed(): Promise<void> {
    // TODO(app): JUM-924 — expose `perks-card-claimed-badge` testid so we
    // don't fall back to the "Claimed" string match.
    await expect(this.perksCardsClaimedBadge).toBeVisible();
  }

  async expectPerkClaimErrorOrIdle(): Promise<void> {
    // After a wallet rejection the UI either shows an error message or simply
    // stays on the unclaimed state — never a stuck spinner. Both outcomes are
    // acceptable; assert the negative case (no claimed badge appeared).
    await expect(this.perksCardsClaimedBadge).toBeHidden();
  }

  async expectPerksCards(): Promise<void> {
    const count = await this.perksCards.count();
    expect(count).toBeGreaterThan(1);
  }

  async expectTransactionsPresent(): Promise<void> {
    await expect(this.noRecentTransactionsLabel).toBeHidden();
  }

  async expectVisible(): Promise<void> {
    // Anchor on the Perks tab — the legacy `.profile-page` wrapper class is
    // no longer rendered, but the Perks/Achievements tabs are stable signals
    // that the profile view (whether full-page or inline) is showing.
    await expect(this.perksTab).toBeVisible();
  }

  async openAchievementsTab(): Promise<void> {
    await expect(this.achievementsTab).toBeVisible();
    await this.achievementsTab.click();
    // 30s timeout: the "Start swapping" CTA is data-driven (shown when the
    // wallet has zero completed swaps) and depends on a backend fetch that
    // can be slow on prod (observed timing-out at the default 10s during
    // D10d smoke). Same pattern as Learn / Scan flake fixes in D10c.
    await expect(this.startSwappingLink).toBeVisible({ timeout: 30_000 });
  }

  async openPerksTab(): Promise<void> {
    await this.perksTab.click();
  }

  async openTransactionHistory(): Promise<void> {
    await this.transactionHistoryButton.click();
  }
}
