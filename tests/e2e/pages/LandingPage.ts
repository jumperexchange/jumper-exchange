import { expect } from '@playwright/test';

import { ROUTE_LABELS } from '../data/urls';

import type { Locator, Page } from '@playwright/test';

const WELCOME_OVERLAY_SELECTOR = '.welcome-screen-container';
const WELCOME_VISIBLE_TIMEOUT_MS = 30_000;
const WELCOME_CLOSE_TIMEOUT_MS = 17_000;

export class LandingPage {
  readonly bridgesCount: Locator;
  readonly chainsCount: Locator;
  readonly dexsCount: Locator;
  readonly getStartedButton: Locator;
  readonly jumperLogo: Locator;
  readonly welcomeOverlay: Locator;

  constructor(private readonly page: Page) {
    this.getStartedButton = page.getByTestId('get-started-button');
    this.welcomeOverlay = page.locator(WELCOME_OVERLAY_SELECTOR);
    this.jumperLogo = page.locator('#jumper-logo');
    // TODO(app): JUM-924 — add `homepage-stat-{chains,bridges,dexs}-count` testids.
    this.chainsCount = page.locator(
      '//*[text()="Chains"]/preceding-sibling::*[1]',
    );
    this.bridgesCount = page.locator(
      '//*[text()="Bridges"]/preceding-sibling::*[1]',
    );
    this.dexsCount = page.locator('//*[text()="DEXs"]/preceding-sibling::*[1]');
  }

  async clickJumperLogo(): Promise<void> {
    await this.jumperLogo.click();
  }

  async clickMenuItem(option: string): Promise<void> {
    await this.page.getByRole('menuitem', { name: option }).click();
  }

  async clickNavItem(option: string): Promise<void> {
    await this.page.getByRole('link', { name: option }).click();
  }

  async closeWelcomeScreen(): Promise<void> {
    await expect(this.getStartedButton).toBeVisible({
      timeout: WELCOME_VISIBLE_TIMEOUT_MS,
    });
    await this.getStartedButton.scrollIntoViewIfNeeded();
    await this.getStartedButton.click();
    await expect(this.welcomeOverlay).not.toBeVisible({
      timeout: WELCOME_CLOSE_TIMEOUT_MS,
    });
  }

  async expectHomepageStatsLoaded(): Promise<void> {
    await this.expectStatGreaterThanZero(this.chainsCount);
    await this.expectStatGreaterThanZero(this.bridgesCount);
    await this.expectStatGreaterThanZero(this.dexsCount);
  }

  async expectRoutesVisibility(options: {
    bestReturnShouldBeVisible: boolean;
    checkRelayRoute?: boolean;
    // Cross-VM bridges (SUI/SOL/BTC → Hypercore) often exceed default 10s; pass 30_000+.
    timeoutMs?: number;
  }): Promise<void> {
    const { bestReturnShouldBeVisible, checkRelayRoute, timeoutMs } = options;

    if (!bestReturnShouldBeVisible) {
      await expect(
        this.page.getByText(ROUTE_LABELS.NO_ROUTES_AVAILABLE),
      ).toBeVisible({ timeout: timeoutMs });
      return;
    }

    // LF-16508: multiple "Best Return" labels can render; the first one is canonical.
    await expect(
      this.page.getByText(ROUTE_LABELS.BEST_RETURN).first(),
    ).toBeVisible({ timeout: timeoutMs });

    if (!checkRelayRoute) {
      return;
    }

    const viewportWidth = this.page.viewportSize()?.width;
    if (viewportWidth !== undefined && viewportWidth < 599) {
      // TODO(app): JUM-924 — add `widget-route-expand-toggle` testid.
      await this.page
        .locator('button.MuiIconButton-root.MuiIconButton-sizeSmall:has(svg)')
        .click();
    }
    const relayLabel = this.page
      .getByText(ROUTE_LABELS.RELAY_VIA_LIFI)
      .filter({ visible: true })
      .first()
      .or(this.page.getByAltText('Relay').filter({ visible: true }).first());
    await expect(relayLabel).toBeVisible();
  }

  async expectWelcomeHeadingVisible(): Promise<void> {
    await expect(
      this.page.getByRole('heading', { name: ROUTE_LABELS.WELCOME_HEADING }),
    ).toBeVisible();
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  // RegExp form is for AB-tested labels (see `EXCHANGE_TAB_LABEL_PATTERN`).
  async navigateAndExpectTab(
    tabKey: number | string,
    expected: RegExp | string,
  ): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.getByTestId(`tab-key-${tabKey}`).click();
    const label =
      typeof expected === 'string'
        ? this.page.getByText(expected, { exact: true })
        : this.page.getByText(expected);
    await expect(label).toBeVisible();
  }

  // Counter animates via useCountUpAnimation; poll the semantic assertion so transient "0" snapshots don't fail us.
  private async expectStatGreaterThanZero(locator: Locator): Promise<void> {
    await expect
      .poll(async () => Number((await locator.textContent()) ?? '0'), {
        timeout: 10_000,
      })
      .toBeGreaterThan(0);
  }
}
