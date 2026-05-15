import { LONG_TIMEOUT } from '../../constants/timeoutConstants';
import PlaywrightFactory from '../../core/playwright/PlaywrightFactory';
import baseSelectors from '../../locators/base';

import type PlaywrightWrapper from '../../core/playwright/PlaywrightWrapper';
import type { BrowserContext, Page } from '@playwright/test';

export type Selectors = Record<string, unknown>;

/**
 * Base class for all page objects, providing common functionality and initializers.
 */
export default class BasePage<TSelectors extends Selectors = Selectors> {
  readonly play: PlaywrightWrapper;
  protected readonly context: BrowserContext;
  protected readonly page: Page;
  protected selectors: TSelectors;
  protected wallet: any;

  /**
   * Creates a page object wrapper around a Playwright page.
   * @param page - Playwright page instance.
   * @param selectors - Page-specific selectors merged with base selectors.
   */
  constructor(page: Page, selectors: TSelectors = {} as TSelectors) {
    this.page = page;
    this.play = PlaywrightFactory.getWrapper(page);
    this.context = page.context();
    this.selectors = { ...baseSelectors, ...selectors } as TSelectors;
  }

  /**
   * Close any unnecessary pages to keep the browser clean
   * @param {BrowserContext} context - The browser context
   * @param {Page} keepPage - The page to keep
   * @returns {Promise<void>}
   */
  static async closeUnnecessaryPages(
    context: BrowserContext,
    keepPage: Page,
  ): Promise<void> {
    const pagesToClose = context.pages().filter((p) => p !== keepPage);
    for (const p of pagesToClose) {
      try {
        await p.close();
      } catch {
        // ignore close errors
      }
    }
  }

  /**
   * Common static initializer used by all Page classes.
   *
   * @template {BasePage} T
   * @param {BrowserContext} context
   * @param {string} url
   * @param PageClass
   * @param {Selectors} selectors
   * @returns {Promise<T>}
   */
  static async initPage<T extends BasePage>(
    context: BrowserContext,
    url: string,
    PageClass: new (page: Page, selectors?: Selectors) => T,
    selectors: Selectors = {},
  ): Promise<T> {
    // Reuse the first page that persistent context creates (about:blank)
    const [firstPage] = context.pages();
    const page = firstPage ?? (await context.newPage());
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Wait for network to settle (don’t fail if app keeps connections open)
    try {
      await page.waitForLoadState('networkidle', { timeout: LONG_TIMEOUT });
    } catch {
      // ignore: SPAs often never reach networkidle due to polling/websockets
    }

    const pageInstance = new PageClass(page, selectors);
    // close other pages (keep the one we’re bound to)
    await BasePage.closeUnnecessaryPages(context, page);
    return pageInstance;
  }

  /**
   * Create another Page Object bound to the same Playwright page.
   * @template {BasePage} T
   * @param PageClass
   * @param {Selectors} selectors
   * @returns {T}
   */
  as<T extends BasePage>(
    PageClass: new (page: Page, selectors?: Selectors) => T,
    selectors: Selectors = {},
  ): T {
    return new PageClass(this.page, selectors);
  }

  /**
   * Gets the wallet instance for the page.
   * @throws {Error} If wallet is not set.
   * @returns {any}
   */
  getWallet(): any {
    if (!this.wallet) {
      throw new Error('Wallet not set. Call page.setWallet(wallet) first.');
    }
    return this.wallet;
  }

  /**
   * Sets the wallet instance for the page.
   * @param {any} wallet
   */
  setWallet(wallet: any): void {
    this.wallet = wallet;
  }

  /**
   * Clicks the first selector in the list that is visible.
   * @param selectors - Candidate selectors to check.
   * @param timeoutMs - Timeout per selector check/click.
   * @returns True when a selector was clicked; false otherwise.
   */
  protected async clickFirstVisible(
    selectors: string[],
    timeoutMs = this.play.DEFAULT_TIMEOUT,
  ): Promise<boolean> {
    for (const selector of selectors) {
      const visible = await this.play.isElementVisible(
        selector,
        null,
        timeoutMs,
        false,
      );
      if (visible) {
        await this.play.click(selector, null, timeoutMs);
        return true;
      }
    }
    console.warn(
      `[clickFirstVisible] No visible element found. Tried selectors:\n` +
        selectors.map((s) => `  - ${s}`).join('\n'),
    );
    return false;
  }
}
