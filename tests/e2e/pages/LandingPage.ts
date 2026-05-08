import { expect } from '@playwright/test';

import { ROUTE_LABELS } from '../data';

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
    // TODO(app): JUM-924 — add `homepage-stat-{chains,bridges,dexs}-count`
    // data-testids on the count <span>s so we can drop the structural
    // preceding-sibling xpath anchors.
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
    await expect(this.chainsCount).not.toHaveText('0', { timeout: 5000 });
    await expect(this.bridgesCount).not.toHaveText('0', { timeout: 5000 });
    await expect(this.dexsCount).not.toHaveText('0', { timeout: 5000 });

    const chains = (await this.chainsCount.textContent()) ?? '0';
    const bridges = (await this.bridgesCount.textContent()) ?? '0';
    const dexs = (await this.dexsCount.textContent()) ?? '0';

    expect(Number(chains)).toBeGreaterThan(0);
    expect(Number(bridges)).toBeGreaterThan(0);
    expect(Number(dexs)).toBeGreaterThan(0);
  }

  async expectRoutesVisibility(options: {
    bestReturnShouldBeVisible: boolean;
    checkRelayRoute?: boolean;
    // Cross-VM bridges (SUI/SOL/BTC → Hypercore) routinely exceed the default
    // 10s expect timeout on LiFi; pass 30_000+ for those.
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
      // TODO(app): JUM-924 — add `widget-route-expand-toggle` testid so we
      // can drop this MUI internal class selector.
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

  // Accepts a string (exact match) or a RegExp (pre-anchored).
  // Used with `EXCHANGE_TAB_LABEL_PATTERN` for AB-tested labels so the spec
  // doesn't fail when the test wallet is bucketed into the alt variant.
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
}
