import test, { expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';
import { triggerButtonClick } from './testData/commonFunctions';
import {
  connectAnotherWalletButton,
  connectButton,
  connectedWalletButton,
  disconnectWalletButton,
  expectSelectWalletOptionToBeVisible,
  selectWalletOption,
} from './testData/connectWalletFunctions';
import {
  clickOnJumperLogo,
  closeWelcomeScreen,
} from './testData/landingPageFunctions';
import { injectMockWallet } from './utils/mockWallet';

test.describe('Connect/disconnect Metamask with Jumper app and open /profile page', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addInitScript({ content: injectMockWallet() });
    await page.goto('/');
  });

  test(qase(36, 'Connect Metamask wallet to Jumper'), async ({ page }) => {
    await test.step('Connect Metamask wallet to Jumper', async () => {
      await connectButton(page).click();
      await expectSelectWalletOptionToBeVisible(page);
      await selectWalletOption(page, 'MetaMask');
    });

    await test.step('Close welcome screen and navigate to profile', async () => {
      await closeWelcomeScreen(page);
      await triggerButtonClick(page, 'Pass');
      await page.locator('.profile-page').isVisible();
    });

    await test.step('Check Perks and Achievements tabs', async () => {
      const perksTab = await page.locator('#profile-tabs-perks');
      const achievementsTab = await page.locator('#profile-tabs-achievements');
      const startSwappingButton = await page.getByRole('link', {
        name: 'Start swapping',
      });
      await expect(achievementsTab).toBeVisible();
      await achievementsTab.click();
      await expect(startSwappingButton).toBeVisible();
      await perksTab.click();
      const perkCards = page.locator('[data-testid="perks-card"]');
      const cardCount = await perkCards.count();
      expect(cardCount).toBeGreaterThan(1);
    });

    await test.step('Check transaction history', async () => {
      const noRecentTransactions = page.locator(
        'xpath=//p[normalize-space(text())="No recent transactions"]',
      );
      const transactionHistoryButton = page.locator(
        '//button[@aria-label="Activities"]',
      );
      await clickOnJumperLogo(page);
      await transactionHistoryButton.click();
      await expect(noRecentTransactions).not.toBeVisible();
    });

    await test.step('Disconnect wallet from the Jumper app ', async () => {
      await connectedWalletButton(page); // click on the connected wallet icon
      await expect(connectAnotherWalletButton(page)).toBeVisible();
      await disconnectWalletButton(page).click();
      await expect(connectButton(page)).toHaveText('Connect');
    });
  });
});
