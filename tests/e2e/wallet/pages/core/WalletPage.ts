import {
  DEFAULT_TIMEOUT,
  LONG_TIMEOUT,
} from '../../constants/timeoutConstants';
import BasePage from './BasePage';

import type { BrowserContext, Page } from '@playwright/test';

export type WalletSelectors = Record<string, unknown>;

class PopupNotFoundError extends Error {}

export default abstract class WalletPage<
  TSelectors extends WalletSelectors = WalletSelectors,
> extends BasePage<TSelectors> {
  protected _defaultExtensionId = '';
  protected _extensionNamePattern = '';
  protected _previousPageContext: BrowserContext | null = null;
  protected page: Page;
  protected selectors: TSelectors;

  /**
   * Base wallet page constructor.
   * @param page - Playwright page instance.
   * @param selectors - Wallet-specific selectors merged by BasePage.
   */
  protected constructor(page: Page, selectors: TSelectors) {
    super(page, selectors);
    this.page = page;
    this.selectors = selectors;
  }

  /**
   * Initializes the browser with the extension and handles initial setup
   * @returns {Promise<{ context: BrowserContext; page: Page }>}
   */
  static async initialize(): Promise<{ context: BrowserContext; page: Page }> {
    throw new Error('Not implemented');
  }

  /**
   * Closes extension and returns to the previous or available page
   * @param previousPage - Page to return to after closing extension
   * @returns Page instance to continue testing with
   */
  async closeExtension(previousPage: Page): Promise<WalletPage> {
    const context = this._previousPageContext || this.page.context();

    try {
      await this.page.close();
    } catch {
      // ignore
    }

    let targetPage =
      previousPage && !previousPage.isClosed()
        ? previousPage
        : context.pages().find((p) => p !== this.page && !p.isClosed());

    if (!targetPage) {
      targetPage = await context.newPage();
    }

    try {
      await targetPage.bringToFront();
    } catch {
      targetPage = await context.newPage();
    }

    return this.createExtensionPageInstance(targetPage);
  }

  /**
   * Completes final onboarding steps after wallet setup
   * @returns Resolves when the final onboarding is complete
   */
  abstract completeFinalOnboarding(): Promise<void>;

  /**
   * Navigates through initial onboarding screens
   * @returns Resolves when the onboarding is complete
   */
  abstract completeInitialOnboarding(): Promise<void>;

  /**
   * ONE canonical entry point for popup confirmations.
   */
  async confirmInPopup(
    context: BrowserContext,
    options: {
      optional?: boolean;
      timeoutMs?: number;
      urlMatchers?: string[];
    } = {},
  ): Promise<boolean> {
    const { optional = false, timeoutMs, urlMatchers } = options;
    try {
      const popupPage = await this.getPopupPage(
        context,
        urlMatchers ?? this.getPopupUrlMatchers(),
        timeoutMs,
      );
      const popupWallet = this.createExtensionPageInstance(popupPage);
      await popupWallet.confirmTransaction();
      return true;
    } catch (error) {
      if (optional && error instanceof PopupNotFoundError) {
        return false;
      }
      throw error;
    }
  }

  /**
   * Confirms a pending transaction in the wallet
   * @returns Resolves when the transaction is confirmed
   */
  abstract confirmTransaction(): Promise<void>;

  /**
   * Handles wallet connection requests from dApps
   * @returns Resolves when the connection is complete
   */
  abstract connectWallet(): Promise<void>;

  /**
   * Creates appropriate extension page instance based on wallet type
   * @param page - Playwright page object
   * @returns Specialized wallet page instance
   */
  abstract createExtensionPageInstance(page: Page): WalletPage;

  /**
   * Search through open tabs and bring matching page to front.
   */
  async findAndFocusMatchingPage(
    context: BrowserContext,
    urlMatchers: string[] = [],
  ): Promise<null | Page> {
    if (!context || !urlMatchers?.length) {
      return null;
    }

    const pages = context.pages();
    for (let i = pages.length - 1; i >= 0; i--) {
      const p = pages[i];
      try {
        const url = p.url();
        const matches = urlMatchers.some((m) => url.includes(m));
        if (matches) {
          await p.bringToFront().catch(() => {});
          return p;
        }
      } catch {
        // ignore
      }
    }
    return null;
  }

  /**
   * Finds the extension ID for the current wallet
   * @returns The extension ID
   */
  async findExtensionId(): Promise<string> {
    if (!this._extensionNamePattern) {
      return this._defaultExtensionId;
    }
    let page: null | Page = null;
    try {
      page = await this.page.context().newPage();
      await page.goto('chrome://extensions');
      const id = await page.evaluate((pattern: string) => {
        interface ChromeExtension {
          enabled: boolean;
          id: string;
          name: string;
        }
        interface ChromeManagementApi {
          getAll(cb: (exts: ChromeExtension[]) => void): void;
        }
        const chromeGlobal = (
          globalThis as unknown as {
            chrome?: { management?: ChromeManagementApi };
          }
        ).chrome;
        const mgmt = chromeGlobal?.management;
        if (!mgmt) {
          return null;
        }
        return new Promise<null | string>((resolve) => {
          mgmt.getAll((exts: ChromeExtension[]) => {
            const ext = exts.find(
              (e) => e.name.toLowerCase().includes(pattern) && e.enabled,
            );
            resolve(ext?.id ?? null);
          });
        });
      }, this._extensionNamePattern);
      return id ?? this._defaultExtensionId;
    } catch {
      return this._defaultExtensionId;
    } finally {
      await page?.close().catch(() => {});
    }
  }

  /**
   * The browser context shared by the extension and dapp tabs. Fixtures
   * and specs use this to open Jumper pages alongside the wallet UI.
   */
  getContext(): BrowserContext {
    return this.page.context();
  }

  /**
   * Extracts the Chrome extension ID from the browser context
   * @param context - Playwright browser context
   * @returns The extension ID
   */
  async getExtensionIdFromContext(context: BrowserContext): Promise<string> {
    const sw = (context as any).serviceWorkers?.()?.[0];
    if (sw) {
      const url = sw.url();
      if (url.startsWith('chrome-extension://')) {
        return new URL(url).host;
      }
    }

    for (const p of context.pages()) {
      const url = p.url();
      if (url.includes('chrome-extension://')) {
        const match = url.match(/chrome-extension:\/\/([^/]+)\//);
        if (match?.[1]) {
          return match[1];
        }
      }
    }

    return this._defaultExtensionId;
  }

  /**
   * Constructs the extension URL based on extension ID
   * @param extensionId - The browser extension ID
   * @returns The full chrome-extension URL
   */
  abstract getExtensionUrl(extensionId: string): string;

  /**
   * Finds the wallet popup page with event wait + fallback scanning.
   */
  async getPopupPage(
    context: BrowserContext,
    urlMatchers: string[] = this.getPopupUrlMatchers(),
    timeoutMs?: number,
  ): Promise<Page> {
    const { retries, retrySleepMs, waitPageMs } = this.getPopupTiming();

    const matches = (url: string) =>
      url !== 'about:blank' && urlMatchers.some((m) => url.includes(m));

    // 0) Already-open fast path: a matching popup may have opened before we
    // started listening; grab it instead of burning the full timeout.
    const existing = await this.findAndFocusMatchingPage(context, urlMatchers);
    if (existing && matches(existing.url())) {
      return await this.preparePopupPage(existing);
    }

    // 1) First try: wait for a page that matches
    try {
      const p = await context.waitForEvent('page', {
        predicate: (page) => matches(page.url()),
        timeout: timeoutMs ?? waitPageMs,
      });
      return await this.preparePopupPage(p);
    } catch {
      // Fall back to scanning
    }

    // 2) Fallback: scan existing pages for a match (handles cases where it opened fast)
    for (let i = 0; i < retries; i++) {
      const popup = await this.findAndFocusMatchingPage(context, urlMatchers);
      if (popup && matches(popup.url())) {
        return await this.preparePopupPage(popup);
      }
      await this.page
        .waitForTimeout(Math.max(50, Math.floor(retrySleepMs / retries)))
        .catch(() => {});
    }

    throw new PopupNotFoundError(
      `Could not detect wallet popup. Matchers: [${urlMatchers.join(', ')}]`,
    );
  }

  /**
   * Timeout helpers (falls back if wrapper constants are missing).
   */
  getPopupTiming(): {
    retries: number;
    retrySleepMs: number;
    waitPageMs: number;
  } {
    const waitPageMs = LONG_TIMEOUT;
    const retrySleepMs = DEFAULT_TIMEOUT;
    const retries = 5;
    return { retries, retrySleepMs, waitPageMs };
  }

  /**
   * URL fragments to identify this wallet's popup/notification page.
   * Subclasses SHOULD override this.
   */
  getPopupUrlMatchers(): string[] {
    return ['notification', 'chrome-extension://'];
  }

  /**
   * Template method that defines the wallet import workflow
   * @param credentials - Wallet seed phrase or private key
   * @param password - Wallet password to set
   * @returns Resolves when the wallet is imported
   */
  async importWallet(credentials: string, password: string): Promise<void> {
    await this.completeInitialOnboarding();
    await this.processCredentials(credentials);
    await this.setupPassword(password);
    await this.completeFinalOnboarding();
  }

  /**
   * Opens the wallet extension in a new tab
   * @returns Extension page and previous page references
   */
  async openExtension(): Promise<{
    extensionPage: WalletPage;
    previousPage: Page;
  }> {
    const previousPage = this.page;
    const context = this.page.context();

    const extensionId = await this.findExtensionId();
    const extensionURL = this.getExtensionUrl(extensionId);

    const newPage = await context.newPage();
    await newPage.goto(extensionURL, { waitUntil: 'domcontentloaded' });

    try {
      await newPage.waitForLoadState('networkidle', { timeout: LONG_TIMEOUT });
    } catch {}

    await newPage.bringToFront();

    const extensionPage = this.createExtensionPageInstance(newPage);
    (extensionPage as any)._previousPageContext = context;

    return { extensionPage, previousPage };
  }

  /**
   * Processes wallet credentials (seed phrase/private key)
   * @param credentials - Wallet seed phrase or private key
   * @returns Resolves when credentials are processed
   */
  abstract processCredentials(credentials: string): Promise<void>;

  /**
   * Sets up wallet password
   * @param password - Wallet password to set
   * @returns Resolves when password is set
   */
  abstract setupPassword(password: string): Promise<void>;

  /**
   * Submits the password to unlock the wallet
   * @param password - Wallet password to submit
   * @returns Resolves when password is submitted
   */
  abstract submitPassword(password: string): Promise<void>;

  /**
   * Unlocks the wallet using the provided password
   * @param password - Wallet password
   * @returns Resolves when the wallet is unlocked
   */
  async unlockWallet(password: string): Promise<void> {
    await this.submitPassword(password);
  }

  /**
   * Normalizes popup readiness by focusing, applying CI viewport, and waiting for DOM content.
   */
  protected async preparePopupPage(popupPage: Page): Promise<Page> {
    await popupPage.bringToFront().catch(() => {});
    if (String(process.env.CI || '').toLowerCase() === 'true') {
      await popupPage
        .setViewportSize({ height: 720, width: 1280 })
        .catch(() => {});
    }
    await popupPage
      .waitForLoadState('domcontentloaded', { timeout: LONG_TIMEOUT })
      .catch(() => {});
    return popupPage;
  }
}
