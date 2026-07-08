import { expect } from '@playwright/test';

import { CHAIN_NAMES_BY_ID, ROUTE_LABELS } from '../data/urls';

import type { WidgetUrlParams } from '../data/urlParams';
import type { Locator, Page } from '@playwright/test';

const WELCOME_OVERLAY_SELECTOR = '.welcome-screen-container';
const WELCOME_VISIBLE_TIMEOUT_MS = 30_000;
const WELCOME_CLOSE_TIMEOUT_MS = 17_000;
const TOKEN_RESOLUTION_TIMEOUT_MS = 30_000;

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
    // 30s is the default — same-chain Arb / ETH route discovery normally
    // completes in 1-3s but spikes to 15-25s when LiFi or jumper-backend
    // pipeline is slow. Cross-VM bridges (SUI/SOL/BTC → Hypercore) need
    // 90_000+; pass explicitly.
    timeoutMs?: number;
  }): Promise<void> {
    const { bestReturnShouldBeVisible, checkRelayRoute } = options;
    const timeoutMs = options.timeoutMs ?? 30_000;

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

  /**
   * Deeplinked token addresses resolve into tokens only after the widget's
   * token list loads — until then the route query is gated off entirely, so
   * under CI load routes can lose the race against a fixed timeout. Waits for
   * the chain badge on the token buttons (renders only once chain AND token
   * resolve); asserting the token symbol would break across environments
   * (develop serves 'USDT' where prod serves 'USDT0' for the same token).
   */
  async expectSwapPairResolved(pair: WidgetUrlParams): Promise<void> {
    await expect(
      this.page
        .getByTestId('widget-from-token-button')
        .getByAltText(this.chainNameOf(pair.fromChain)),
    ).toBeVisible({ timeout: TOKEN_RESOLUTION_TIMEOUT_MS });
    await expect(
      this.page
        .getByTestId('widget-to-token-button')
        .getByAltText(this.chainNameOf(pair.toChain)),
    ).toBeVisible({ timeout: TOKEN_RESOLUTION_TIMEOUT_MS });
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

  // The vertical menu is static since JUM-1241 (0 = Simple, 1 = Advanced); the
  // destination is asserted via a widget tab unique to it, so the check cannot
  // false-pass against the outgoing page mid-navigation (role=tab name
  // matching is exact — "Bridge" does not match "Swap & Bridge").
  async navigateAndExpectWidgetTab(
    tabKey: number,
    widgetTab: string,
  ): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.getByTestId(`tab-key-${tabKey}`).click();
    await expect(this.page.getByRole('tab', { name: widgetTab })).toBeVisible();
  }

  private chainNameOf(chainId: string): string {
    const name = CHAIN_NAMES_BY_ID[chainId];
    if (!name) {
      throw new Error(
        `No display name mapped for chain ${chainId} — add it to CHAIN_NAMES_BY_ID in data/urls.ts`,
      );
    }
    return name;
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
