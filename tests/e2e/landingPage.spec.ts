import { qase } from 'playwright-qase-reporter';

import { EXCHANGE_TAB_LABEL_PATTERN, WALLET_OPTIONS } from './data';
import { noWalletTest as test } from './fixtures/noWallet';
import { ConnectWalletPage, LandingPage } from './pages';

test.describe('Landing page and navigation', () => {
  test.beforeEach(async ({ page }) => {
    const landingPage = new LandingPage(page);
    await landingPage.goto();
    await page.waitForLoadState('load');
    await landingPage.closeWelcomeScreen();
  });

  test(
    qase(2, 'Should navigate to the homepage and change tabs'),
    async ({ page }) => {
      const landingPage = new LandingPage(page);
      await page.waitForLoadState('domcontentloaded');
      await landingPage.navigateAndExpectTab(1, 'Gas');
      // Exchange tab label is AB-tested (`a-b-test-trade-display`); accept any variant.
      await landingPage.navigateAndExpectTab(0, EXCHANGE_TAB_LABEL_PATTERN);
    },
  );

  test(
    qase(1, 'Should show again welcome screen when clicking jumper logo'),
    async ({ page }) => {
      const landingPage = new LandingPage(page);
      await landingPage.clickJumperLogo();
      await landingPage.expectWelcomeHeadingVisible();
      await landingPage.closeWelcomeScreen();
    },
  );

  test(
    qase(35, 'QR code should be visible when select wallet connect option'),
    async ({ page }) => {
      const connectWalletPage = new ConnectWalletPage(page);
      await connectWalletPage.clickConnect();
      await page
        .getByText(WALLET_OPTIONS.WALLET_CONNECT, { exact: true })
        .click();
      await connectWalletPage.expectQrCodeVisible();
    },
  );
});
