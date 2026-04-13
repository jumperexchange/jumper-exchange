import { expect, test } from '@playwright/test';
import {
  closeWelcomeScreen,
  navigateToTab,
  clickOnJumperLogo,
} from './testData/landingPageFunctions';
import { connectButton } from './testData/connectWalletFunctions';
import { qase } from 'playwright-qase-reporter';
import values from './testData/values.json' with { type: 'json' };

test.describe('Landing page and navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('load');
    await closeWelcomeScreen(page);
  });

  test(
    qase(2, 'Should navigate to the homepage and change tabs'),
    async ({ page }) => {
      await page.waitForLoadState('domcontentloaded');
      await navigateToTab(page, 1, 'Gas');
      await navigateToTab(page, 0, 'Exchange');
    },
  );

  test(
    qase(
      56,
      'Should navigate to private tab, show correct widget title and call private API',
    ),
    async ({ page }) => {
      const privateApiRequestPromise = page.waitForRequest(
        (req) => req.url().includes('/private/'),
        { timeout: 30_000 },
      );

      await navigateToTab(page, 2, 'Private Swap');
      await expect(page).toHaveURL('/private');

      const widgetTitle = page.getByText('Anonymous Swap');
      await expect(widgetTitle).toBeVisible();

      const privateApiRequest = await privateApiRequestPromise;
      expect(privateApiRequest.url()).toContain('/private/');
    },
  );

  test(
    qase(1, 'Should show again welcome screen when clicking jumper logo'),
    async ({ page }) => {
      const headerText = 'Find the best route';
      await clickOnJumperLogo(page);
      await closeWelcomeScreen(page);
      await expect(headerText).toBe('Find the best route');
    },
  );

  test(
    qase(35, 'QR code should be visible when select wallet connect option'),
    async ({ page }) => {
      const walletConnectOption = page.locator(
        'xpath=//span[normalize-space(text())="WalletConnect"]',
      );
      await connectButton(page).click();
      await walletConnectOption.click();
      const walletConnectModal = page.locator('[data-testid="w3m-modal-card"]');
      const scanQRCodeTitle = walletConnectModal.getByText(
        values.scanQRCodeTitle,
      );
      const qrCode = walletConnectModal.locator('[data-testid="wui-qr-code"]');
      await expect(qrCode).toBeVisible();
      await expect(scanQRCodeTitle).toBeVisible();
    },
  );
});
