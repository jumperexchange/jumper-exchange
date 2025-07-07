import { testWithSynpress } from '@synthetixio/synpress-core';
import { MetaMask, metaMaskFixtures } from '@synthetixio/synpress';
import {
  closeWelcomeScreen,
  clickOnJumperLogo,
} from './testData/landingPageFunctions';
import { triggerButtonClick } from './testData/commonFunctions';
import {
  connectButton,
  connectAnotherWalletButton,
  disconnectWalletButton,
  connectedWalletButton,
} from './testData/connectWalletFunctions';
import basicSetup from './wallet-setup/basic.setup';

const test = testWithSynpress(metaMaskFixtures(basicSetup));
const { expect } = test;

test.describe('Connect/disconnect Metamask with Jumper app and open /profile page', () => {
  test('Complete wallet connection and disconnection flow', async ({
    context,
    page,
    extensionId,
  }) => {
    await test.step('Connect Metamask wallet to Jumper', async () => {
      const metamask = new MetaMask(
        context,
        page,
        basicSetup.walletPassword,
        extensionId,
      );
      const metaMaskWalletOption = page.locator(
        'xpath=//span[normalize-space(text())="MetaMask"]',
      );

      await page.goto('/');
      await expect(connectButton(page)).toBeEnabled();
      await connectButton(page).click();
      await metaMaskWalletOption.click();
      await metamask.connectToDapp(['Account 1']);
    });

    await test.step('Close welcome screen and navigate to profile', async () => {
      await closeWelcomeScreen(page);
      await triggerButtonClick(page, 'Level');
      await page.locator('.profile-page').isVisible();
    });

    await test.step('Check transaction history', async () => {
      const noRecentTransactions = page.locator(
        'xpath=//p[normalize-space(text())="No recent transactions"]',
      );
      const transactionHistoryButton = page.locator(
        '//button[@aria-label="Transaction history"]',
      );
      await clickOnJumperLogo(page);
      await closeWelcomeScreen(page);
      await transactionHistoryButton.click();
      await expect(noRecentTransactions).toBeVisible();
    });

    await test.step('Disconnect wallet from the Jumper app ', async () => {
      await connectedWalletButton(page); // click on the connected wallet icon
      await expect(connectAnotherWalletButton(page)).toBeVisible();
      await disconnectWalletButton(page).click();
      await expect(connectButton(page)).toHaveText('Connect');
    });
  });
});
