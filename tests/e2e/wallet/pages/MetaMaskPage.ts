import { expect } from '@playwright/test';

import { EXTENSION_NAME } from '../constants/extensionConstants';
import { LONG_TIMEOUT } from '../constants/timeoutConstants';
import { launchBrowserWithExtension } from '../core/browser/BrowserManager';
import { metamaskLocators as selectors } from '../locators/metaMask';
import { clearOsClipboard, writeOsClipboard } from '../utils/clipboard';
import WalletPage from './core/WalletPage';

import type { BrowserContext, Page } from '@playwright/test';

export interface NetworkDetails {
  blockExplorer?: string;
  chainId: string;
  currencySymbol: string;
  networkName: string;
  rpcUrl: string;
}

export default class MetaMaskPage extends WalletPage {
  selectors = selectors;
  protected _defaultExtensionId = 'jgajjncgjhlffkjcefajomdaollnghjl';
  protected _extensionNamePattern = EXTENSION_NAME.METAMASK;

  constructor(page: Page, pageSelectors: any = selectors) {
    super(page, pageSelectors);
    this.selectors = pageSelectors;
  }

  /**
   * Static method to initialize the browser with MetaMask and handle initial setup
   * @returns {Promise<{context: BrowserContext, page: Page}>} - Returns browser context and page
   */
  static async initialize(): Promise<{ context: BrowserContext; page: Page }> {
    const context = await launchBrowserWithExtension(EXTENSION_NAME.METAMASK);
    const extensionPage = await context.waitForEvent('page');
    await extensionPage.waitForURL('**/home.html#/onboarding/welcome');
    const tempMetaMaskPage = new MetaMaskPage(extensionPage);
    tempMetaMaskPage._defaultExtensionId =
      await tempMetaMaskPage.getExtensionIdFromContext(context);
    await extensionPage.bringToFront();
    return { context, page: extensionPage };
  }

  /**
   * Adds a custom network and selects it in MetaMask
   * @param {NetworkDetails} networkDetails - The details of the network to add
   * @returns {Promise<void>}
   */
  async addAndSelectNetwork(networkDetails: NetworkDetails): Promise<void> {
    await this.addCustomNetwork(networkDetails);
    await this.skipRedeemRewards();
  }

  /**
   * Adds and switches to a custom network in MetaMask
   * @param {NetworkDetails} details - The details of the network to add
   * @returns {Promise<void>}
   */
  async addCustomNetwork(details: NetworkDetails): Promise<void> {
    const { chainId, currencySymbol, networkName, rpcUrl } = details;

    // Click on the network selector dropdown
    await this.openAccountOptionsMenu();
    await this.play.click(this.selectors.wallet.networks);

    // Wait for a dropdown and click "Add network"
    await this.play.click(this.selectors.network.addCustomNetworkButton);

    // Fill in the network form
    await this.play.fill(
      this.selectors.network.networkForm.networkName,
      networkName,
    );
    await this.addRpcUrl(rpcUrl);
    await this.play.fill(this.selectors.network.networkForm.chainId, chainId);
    await this.play.fill(
      this.selectors.network.networkForm.currencySymbol,
      currencySymbol,
    );

    // Save the network
    await this.play.click(this.selectors.network.networkForm.saveButton);

    console.log(
      'Successfully added network and switched to custom network:',
      networkName,
    );
  }

  /**
   * Adds a custom RPC URL to MetaMask
   * @param rpcUrl - The RPC URL to add
   * @returns {Promise<void>} - Returns a promise that resolves after the operation is complete
   */
  async addRpcUrl(rpcUrl: string): Promise<void> {
    // Click on the RPC dropdown button
    await this.play.click(this.selectors.network.addRpcDropdownButton);
    // Click on the "Add RPC" button
    await this.play.click(this.selectors.network.addRpcUrlInModalButton);
    // Fill the RPC URL field
    await this.play.fill(this.selectors.network.networkForm.rpcUrl, rpcUrl);
    // Click on the "Add URL" button to confirm
    await this.play.click(this.selectors.network.addUrlButton);
  }

  /**
   * Completes the final onboarding steps
   * @returns {Promise<void>}
   */
  async completeFinalOnboarding(): Promise<void> {
    await this.play.click(this.selectors.onboarding.denyMetricsCheck);
    await this.play.click(
      this.selectors.onboarding.proceedWithoutMetricsButton,
    );
    await this.play.click(this.selectors.onboarding.doneButton);
  }

  /**
   * Completes the initial onboarding steps
   * @returns {Promise<void>} - Returns a promise that resolves after the onboarding is complete
   */
  async completeInitialOnboarding(): Promise<void> {
    await this.play.click(this.selectors.onboarding.importExistingButton);
    await this.play.click(this.selectors.onboarding.useSeedPhraseButton);
    await this.play.click(this.selectors.seedPhrase.inputField);
  }

  /**
   * Confirms a transaction in MetaMask
   * @returns {Promise<void>} - Returns a promise that resolves after the transaction is confirmed
   */
  async confirmTransaction(): Promise<void> {
    const primary = this.selectors.transaction.confirmTxn;
    const fallback = this.selectors.transaction.confirm;

    if (await this.play.isElementVisible(primary, null, LONG_TIMEOUT)) {
      await this.play.click(primary, 0, LONG_TIMEOUT);
      return;
    }

    if (await this.play.isElementVisible(fallback, null, LONG_TIMEOUT)) {
      await this.play.click(fallback, 0, LONG_TIMEOUT);
      return;
    }

    throw new Error('No MetaMask confirm button found (confirmTxn / confirm)');
  }

  /**
   * Approves the connection popup spawned when a dapp calls `eth_requestAccounts`.
   * The connect button (`confirm-btn`) lives in a separate popup window —
   * locate that popup before clicking, same pattern as confirmInPopup.
   */
  async connectInPopup(context: BrowserContext): Promise<void> {
    const popupPage = await this.getPopupPage(
      context,
      this.getPopupUrlMatchers(),
    );
    await popupPage.waitForLoadState('domcontentloaded');
    await popupPage.bringToFront().catch(() => {});
    const popupWallet = this.createExtensionPageInstance(popupPage);
    await popupWallet.connectWallet();
  }

  /**
   * Approves a connection request from a dApp
   * @returns {Promise<void>} - Returns a promise that resolves after the wallet is connected
   */
  async connectWallet(): Promise<void> {
    await this.play.waitForElementToBeVisible(
      this.selectors.connection.connectWalletButton,
    );
    await this.play.click(this.selectors.connection.connectWalletButton);
  }

  /**
   * Creates a new instance of MetaMaskPage for a specific page
   * @param {Page} page - The Playwright page object
   * @returns {MetaMaskPage} - A new instance of MetaMaskPage
   */
  createExtensionPageInstance(page: Page): MetaMaskPage {
    const instance = new MetaMaskPage(page, this.selectors);
    instance._defaultExtensionId = this._defaultExtensionId;
    return instance;
  }

  async expectNetworkVisible(networkName: string): Promise<void> {
    await expect(
      this.page.getByText(networkName, { exact: false }).first(),
    ).toBeVisible({ timeout: LONG_TIMEOUT });
  }

  /**
   * Validates the word count, then enters the phrase with a single paste (see
   * pasteSecret) — MetaMask distributes a pasted phrase across the SRP inputs.
   *
   * @param {string} seedPhrase - The provided seed phrase.
   * @throws {Error} If the phrase does not contain a valid number of words.
   */
  async fillSeedPhrase(seedPhrase: string): Promise<void> {
    const words = seedPhrase.split(/[\s,]+/).filter((w) => w.trim());

    const valid = [12, 15, 18, 21, 24];
    if (!valid.includes(words.length)) {
      throw new Error(
        `Seed phrase must be one of [${valid.join(', ')}], got ${words.length}`,
      );
    }

    await this.pasteSecret(
      this.selectors.seedPhrase.inputField,
      words.join(' '),
    );
  }

  /**
   * Generates the MetaMask home page URL for a given extension ID
   */
  getExtensionUrl(extId: string): string {
    return `chrome-extension://${extId}/home.html`;
  }

  /**
   * URL fragments to identify MetaMask popup/notification pages.
   * Only `notification.html` is the actual popup; broader fragments
   * (`metamask`, `chrome-extension://`) also match the main wallet
   * tab and caused the scan fallback to grab it instead of a
   * sequential popup when the popup hadn't spawned yet.
   */
  getPopupUrlMatchers(): string[] {
    return ['notification.html'];
  }

  /**
   * Processes the seed phrase and fills the input fields
   * @param {string} credentials - The seed phrase to process
   * @returns {Promise<void>} - Returns a promise that resolves after the seed phrase is filled
   */
  async processCredentials(credentials: string): Promise<void> {
    await this.fillSeedPhrase(credentials);
    await this.play.click(this.selectors.seedPhrase.confirmButton);
  }

  /**
   * Rejects the popup that's currently open in `context`.
   */
  async rejectPopup(context: BrowserContext): Promise<void> {
    const popupPage = await this.getPopupPage(
      context,
      this.getPopupUrlMatchers(),
    );
    await popupPage.waitForLoadState('domcontentloaded');
    await popupPage.bringToFront().catch(() => {});
    const popupWallet = this.createExtensionPageInstance(popupPage);
    await popupWallet.rejectTransaction();
  }

  /**
   * Rejects the active confirmation popup (signature / transaction / network switch).
   */
  async rejectTransaction(): Promise<void> {
    await this.play.click(
      this.selectors.transaction.cancelTxn,
      0,
      LONG_TIMEOUT,
    );
  }

  /**
   * Sets up the password for the wallet
   * @param {string} password - Password to set
   * @returns {Promise<void>}
   */
  async setupPassword(password: string): Promise<void> {
    await this.pasteSecret(this.selectors.password.newInput, password);
    await this.pasteSecret(this.selectors.password.confirmInput, password);
    await this.play.click(this.selectors.password.termsCheckbox);
    await this.play.click(this.selectors.password.importButton);
  }

  /**
   * Approves a signature popup spawned by a dapp action. Same UI button as a
   * transaction confirm in current MetaMask versions; aliased for spec clarity.
   */
  async signPopup(context: BrowserContext): Promise<void> {
    await this.confirmInPopup(context);
  }

  /**
   * Signs the next wallet popup if one appears within `timeoutMs`. Returns
   * true when a popup was signed, false when none appeared. Use for flows
   * where a second signature is conditional — e.g. an ERC-20 approval before
   * a swap, where the approval popup is skipped on wallets with sufficient
   * existing allowance.
   */
  async signPopupIfPresent(
    context: BrowserContext,
    timeoutMs: number = 15_000,
  ): Promise<boolean> {
    return this.confirmInPopup(context, { optional: true, timeoutMs });
  }

  /**
   * Skips the "Redeem Rewards" notification in MetaMask
   * @returns {Promise<void>}
   */
  async skipRedeemRewards(): Promise<void> {
    const selector = this.selectors.network.networkForm.notNowRedeemButton;
    if (await this.play.isElementVisible(selector)) {
      await this.play.click(selector, 0, LONG_TIMEOUT);
    }
  }

  /**
   * Submits the password to unlock the wallet
   * @param {string} password - Wallet password to submit
   * @returns {Promise<void>}
   */
  async submitPassword(password: string): Promise<void> {
    await this.play.fillSecret(
      this.selectors.password.unlockPasswordInput,
      password,
    );
    await this.play.click(this.selectors.password.unlockSubmitButton);
  }

  /**
   * Approves the network-switch popup spawned by `wallet_switchEthereumChain`.
   * Reuses the same confirm button as transactions.
   */
  async switchNetworkFromPopup(context: BrowserContext): Promise<void> {
    await this.confirmInPopup(context);
  }

  /**
   * Detects the MetaMask unread notifications badge intercepting clicks on the account menu.
   */
  private isNotificationsBadgeInterception(error: unknown): boolean {
    const message = error instanceof Error ? error.message : String(error);
    return message.includes('notifications-tag-counter__unread-dot');
  }

  /**
   * Opens the account options menu, falling back to a forced click when the unread badge overlays it.
   */
  private async openAccountOptionsMenu(): Promise<void> {
    try {
      await this.play.click(this.selectors.wallet.settings, 0, LONG_TIMEOUT);
    } catch (error) {
      if (!this.isNotificationsBadgeInterception(error)) {
        throw error;
      }

      await this.play.forceClick(
        this.selectors.wallet.settings,
        0,
        LONG_TIMEOUT,
      );
    }
  }

  /**
   * Enters a wallet secret by pasting it from the OS clipboard rather than
   * typing it. A typed `fill()`/`type()` records the value verbatim in
   * Playwright's trace, which is published to a public GitHub Pages report;
   * a pasted value travels OS clipboard -> browser and never passes through a
   * traced call, so the trace only captures the Ctrl/Cmd+V keypress. The
   * clipboard is cleared afterwards so the secret does not linger.
   */
  private async pasteSecret(selector: string, value: string): Promise<void> {
    writeOsClipboard(value);
    try {
      await this.play.click(selector);
      await this.page.keyboard.press('ControlOrMeta+V');
    } finally {
      clearOsClipboard();
    }
  }
}
