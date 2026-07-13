import { expect } from '@playwright/test';

import { CHAIN_NAMES_BY_ID, ROUTE_LABELS } from '../data/urls';

import type { WidgetUrlParams } from '../data/urlParams';
import type { Locator, Page } from '@playwright/test';

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
    this.welcomeOverlay = page.getByTestId('welcome-screen');
    this.jumperLogo = page.locator('#jumper-logo');
    this.chainsCount = page.getByTestId('homepage-stat-chains-count');
    this.bridgesCount = page.getByTestId('homepage-stat-bridges-count');
    this.dexsCount = page.getByTestId('homepage-stat-dexs-count');
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
      // TODO(app): JUM-924 — swap to `widget-route-expand-toggle` at the widget bump.
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
   * the chain-name subheader (renders only once chain AND token resolve);
   * asserting the token symbol would break across environments (develop
   * serves 'USDT' where prod serves 'USDT0' for the same Arbitrum token).
   */
  async expectSwapPairResolved(pair: WidgetUrlParams): Promise<void> {
    await expect(
      this.tokenCard('From').getByText(this.chainNameOf(pair.fromChain), {
        exact: true,
      }),
    ).toBeVisible({ timeout: TOKEN_RESOLUTION_TIMEOUT_MS });
    await expect(
      this.tokenCard('To').getByText(this.chainNameOf(pair.toChain), {
        exact: true,
      }),
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

  async navigateAndExpectTab(
    tabKey: number | string,
    expected: RegExp | string,
  ): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.getByTestId(`tab-key-${tabKey}`).click();
    // The RegExp form targets the AB-tested Exchange label; scope it to the
    // navbar button so it can't collide with the widget header, which renders
    // the same "Swap & Bridge" text page-wide.
    const label =
      typeof expected === 'string'
        ? this.page.getByText(expected, { exact: true })
        : this.page.getByTestId('navbar-exchange-button').getByText(expected);
    await expect(label).toBeVisible();
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

  // TODO(app): JUM-924 item #15 — swap to `widget-{from,to}-token-button` once the widget dep is ≥4.2.0.
  private tokenCard(title: 'From' | 'To'): Locator {
    return this.page
      .locator('button')
      .filter({ has: this.page.getByText(title, { exact: true }) });
  }
}
