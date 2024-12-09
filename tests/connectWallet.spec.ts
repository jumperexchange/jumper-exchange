import { execSync } from 'child_process';
import { testWithSynpress } from '@synthetixio/synpress-core';
import { MetaMask, metaMaskFixtures } from '@synthetixio/synpress';
import { openOrCloseMainMenu, itemInMenu, closeWelcomeScreen } from './testData/commonFunctions';
import basicSetup from './wallet-setup/basic.setup';

const test = testWithSynpress(metaMaskFixtures(basicSetup));
const { expect } = test;

test.describe('Connect Metamask with Jumper app and open /profile page', () => {
  test('should connect wallet to Jumper', async ({
    context,
    page,
    extensionId,
  }) => {
    const metamask = new MetaMask(
      context,
      page,
      basicSetup.walletPassword,
      extensionId,
    );
    const connectWalletButton = page.locator('#connect-wallet-button');
    const metaMaskWalletOption = page.locator('xpath=//span[normalize-space(text())="MetaMask"]');
    const availableMissionTitle = page.locator('xpath=//p[normalize-space(text())="Available Missions"]');
    const ethereumOption = page.locator('xpath=//span[normalize-space(text())="Ethereum"]');
    await page.goto('/');
    await expect(connectWalletButton).toBeEnabled();
    await connectWalletButton.click();
    await metaMaskWalletOption.click();
    await ethereumOption.click();
    await metamask.connectToDapp(['Account 1']);
    await closeWelcomeScreen(page);
    await openOrCloseMainMenu(page);
    await itemInMenu(page, 'Jumper Profile');
    await page.locator('.profile-page').isVisible();
    await expect(availableMissionTitle).toBeVisible();
  });
});
