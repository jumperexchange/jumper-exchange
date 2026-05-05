import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export const connectedWalletButton = async (page: Page) => {
  await page.locator('#wallet-digest-button').click();
};

export const connectButton = (page: Page) => {
  return page.locator('#connect-wallet-button').first();
};
export const selectWalletDialog = (page: Page) => {
  return page.getByRole('dialog').filter({ hasText: 'Select a wallet' });
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

export const selectEcosystemDialog = (page: Page) => {
  return page.getByRole('dialog', { name: 'Select an ecosystem' });
};

export const selectEcosystemOption = async (
  page: Page,
  ecosystem: 'Ethereum' | 'Tron' | 'Solana' | 'Bitcoin' | 'Sui',
) => {
  const dialog = selectEcosystemDialog(page);
  await expect(dialog).toBeVisible();
  await dialog.getByText(ecosystem, { exact: true }).click();
};

export const selectWalletOption = async (
  page: Page,
  option: string,
  ecosystem: 'Ethereum' | 'Tron' | 'Solana' | 'Bitcoin' | 'Sui' = 'Ethereum',
) => {
  await selectWalletDialog(page).getByText(option).click();
  // Some wallets (e.g. MetaMask) support multiple ecosystems and prompt the
  // user to choose one before proceeding. If that dialog appears, pick the
  // requested ecosystem (defaults to Ethereum to preserve existing behavior).
  const ecosystemDialog = selectEcosystemDialog(page);
  if (await ecosystemDialog.isVisible().catch(() => false)) {
    await ecosystemDialog.getByText(ecosystem, { exact: true }).click();
  }
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

export const closeWalletDrawer = async (page: Page) => {
  await walletDrawer(page).getByRole('button', { name: 'close' }).click();
};
