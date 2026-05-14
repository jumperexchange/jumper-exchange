import { expect } from '@playwright/test';

import { JUMPER_BUTTONS, UI_STRINGS } from '../data/urls';

import type { ChainName } from '../data/urls';
import type { Locator, Page } from '@playwright/test';

export class ConnectWalletPage {
  readonly connectAnotherWalletButton: Locator;
  readonly connectButton: Locator;
  readonly disconnectWalletButton: Locator;
  readonly selectWalletDialog: Locator;
  readonly walletCards: Locator;
  readonly walletDigestButton: Locator;
  readonly walletDrawer: Locator;
  readonly walletDrawerCloseButton: Locator;

  constructor(private readonly page: Page) {
    this.connectButton = page.locator('#connect-wallet-button').first();
    this.walletDigestButton = page.locator('#wallet-digest-button');
    this.selectWalletDialog = page
      .getByRole('dialog')
      .filter({ hasText: 'Select a wallet' });
    this.connectAnotherWalletButton = page.locator(
      '#connect-another-wallet-button',
    );
    this.disconnectWalletButton = page.locator('#disconnect-wallet-button');
    this.walletDrawer = page.getByTestId('wallet-drawer');
    this.walletCards = this.walletDrawer.getByTestId('wallet-balance-card');
    this.walletDrawerCloseButton = this.walletDrawer.getByRole('button', {
      name: 'close',
    });
  }

  async clickConnect(): Promise<void> {
    await this.connectButton.click();
  }

  async clickDisconnect(): Promise<void> {
    await this.disconnectWalletButton.click();
  }

  async closeWalletDrawer(): Promise<void> {
    await this.walletDrawerCloseButton.click();
  }

  async expectDisconnected(): Promise<void> {
    await expect(this.connectButton).toHaveText(JUMPER_BUTTONS.CONNECT);
  }

  async expectDisconnectMenuVisible(): Promise<void> {
    await expect(this.connectAnotherWalletButton).toBeVisible();
  }

  // Encapsulates the Reown/WalletConnect modal testids (`w3m-modal-card`, `wui-qr-code`).
  async expectQrCodeVisible(): Promise<void> {
    const modal = this.page.locator('[data-testid="w3m-modal-card"]');
    await expect(modal.locator('[data-testid="wui-qr-code"]')).toBeVisible();
    await expect(modal.getByText(UI_STRINGS.SCAN_QR_CODE_TITLE)).toBeVisible();
  }

  async expectSelectWalletDialogVisible(): Promise<void> {
    await expect(this.selectWalletDialog).toBeVisible();
    await expect(
      this.selectWalletDialog.getByRole('heading', { name: 'Select a wallet' }),
    ).toBeVisible();
  }

  async getConnectedWalletCount(): Promise<number> {
    return this.walletCards.count();
  }

  async openConnectedWalletMenu(): Promise<void> {
    await this.walletDigestButton.click();
  }

  async openWalletDrawer(): Promise<void> {
    await this.walletDigestButton.click();
    await expect(this.walletDrawer).toBeVisible();
  }

  // Post-MetaMask "Select an ecosystem" dialog — must pick before the popup fires.
  async selectEcosystem(name: ChainName): Promise<void> {
    const dialog = this.page
      .getByRole('dialog')
      .filter({ hasText: 'Select an ecosystem' });
    await expect(dialog).toBeVisible();
    await dialog.getByText(name, { exact: true }).click();
  }

  async selectWalletOption(option: string): Promise<void> {
    await this.selectWalletDialog.getByText(option).click();
  }
}
