import { WALLET_OPTIONS, WIDGET_TABS } from './data/urls';
import { noWalletTest as test } from './fixtures/noWallet';
import { ConnectWalletPage } from './pages/ConnectWalletPage';
import { LandingPage } from './pages/LandingPage';
import { seedWelcomeScreenClosed } from './utils/welcomeScreen';

test.describe('Landing page and navigation', () => {
  test.beforeEach(async ({ page }) => {
    const landingPage = new LandingPage(page);
    await seedWelcomeScreenClosed(page);
    await landingPage.goto();
    await page.waitForLoadState('load');
  });

  test('Should land on Simple and gate the Advanced tab for anonymous users', async ({
    page,
  }) => {
    const landingPage = new LandingPage(page);
    await page.waitForLoadState('domcontentloaded');
    // Advanced is gated behind the widget-advanced flag + hasAdvanced allowlist;
    // anonymous users land on Simple with the Advanced tab rendered but
    // disabled. Re-scope to a click-through once the feature goes GA.
    await landingPage.expectVerticalTabSelected(0);
    await landingPage.expectVerticalTabDisabled(1);
    await landingPage.expectWidgetTabVisible(
      WIDGET_TABS.SIMPLE_SWAP_AND_BRIDGE,
    );
  });

  test('Should show again welcome screen when clicking jumper logo', async ({
    page,
  }) => {
    const landingPage = new LandingPage(page);
    await landingPage.clickJumperLogo();
    await landingPage.expectWelcomeHeadingVisible();
    await landingPage.closeWelcomeScreen();
  });

  // JUM-1116: the WalletConnect QR needs a live wss relay handshake (relay.walletconnect.org)
  // the CI runner can't reach → modal stays "Connecting", QR never renders (0/15 in CI; confirmed
  // via trace + local relay-block A/B). Re-enable when CI egress to the WC relay is restored.
  test.fixme('QR code should be visible when select wallet connect option', async ({
    page,
  }) => {
    const connectWalletPage = new ConnectWalletPage(page);
    await connectWalletPage.clickConnect();
    await page
      .getByText(WALLET_OPTIONS.WALLET_CONNECT, { exact: true })
      .click();
    await connectWalletPage.expectQrCodeVisible();
  });
});
