import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export const connectedWalletButton = async (page: Page) => {
  await page.locator('#wallet-digest-button').click();
};

export const connectButton = (page: Page) => {
  return page.locator('#connect-wallet-button').first();
};
export const selectWalletDialog = (page: Page) => {
  return page.getByRole('dialog', { name: 'Select a wallet' });
};

export const expectSelectWalletOptionToBeVisible = async (page: Page) => {
  await expect(selectWalletDialog(page)).toBeVisible();
  const selectWalletTitle = await selectWalletDialog(page).getByRole(
    'heading',
    {
      name: 'Select a wallet',
    },
  );
  await expect(selectWalletTitle).toBeVisible();
};

export const selectWalletOption = async (page: Page, option: string) => {
  await selectWalletDialog(page).getByText(option).click();
};

export const openConnectedWallet = async (page: Page, address: string) => {
  const truncatedAddress = `${address.slice(0, 7)}...${address.slice(-5)}`;
  const connectedWalletButton = page.getByRole('button', {
    name: `wallet-avatar chain-avatar ${truncatedAddress}`,
  });
  await connectedWalletButton.click();
};

export const connectAnotherWalletButton = (page: Page) => {
  return page.locator('#connect-another-wallet-button');
};

export const disconnectWalletButton = (page: Page) => {
  return page.locator('#disconnect-wallet-button');
};

export const walletDrawer = (page: Page) => {
  return page.getByTestId('wallet-drawer');
};

export const walletCards = (page: Page) => {
  return walletDrawer(page).getByTestId('wallet-balance-card');
};

export const openWalletDrawer = async (page: Page) => {
  await page.locator('#wallet-digest-button').click();
  await expect(walletDrawer(page)).toBeVisible();
};

export const getConnectedWalletCount = async (page: Page) => {
  return walletCards(page).count();
};

export const expectConnectedWalletCount = async (page: Page, count: number) => {
  await expect(walletCards(page)).toHaveCount(count);
};

export const closeWalletDrawer = async (page: Page) => {
  await walletDrawer(page).getByRole('button', { name: 'close' }).click();
};
