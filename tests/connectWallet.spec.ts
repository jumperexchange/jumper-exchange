import { testWithSynpress } from '@synthetixio/synpress-core';
import { MetaMask, metaMaskFixtures } from '@synthetixio/synpress';
import {
  closeWelcomeScreen,
  itemInNavigation,
} from './testData/landingPageFunctions';
import basicSetup from './wallet-setup/basic.setup';
import { triggerButtonClick } from './testData/commonFunctions';

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
    const metaMaskWalletOption = page.locator(
      'xpath=//span[normalize-space(text())="MetaMask"]',
    );
    const noRecentTransactions = page.locator(
      'xpath=//p[normalize-space(text())="No recent transactions"]',
    );
    const transactionHistoryButton = page.locator(
      'xpath=//button[@aria-label="Transaction history"]',
    );
    // const ethereumOption = page.locator(
    //   'xpath=//span[normalize-space(text())="Ethereum"]',
    // );
    await page.goto('/');
    await expect(connectWalletButton).toBeEnabled();
    await connectWalletButton.click();
    await metaMaskWalletOption.click();
    // await ethereumOption.click();
    await metamask.connectToDapp(['Account 1']);
    await closeWelcomeScreen(page);
    await transactionHistoryButton.click();
    await expect(noRecentTransactions).toBeVisible();
    await triggerButtonClick(page, 'Level');
    await page.locator('.profile-page').isVisible();
  });
});
