import { CHAINS, WALLET_OPTIONS } from './data/urls';
import { realWalletTest as test } from './fixtures/realWallet';
import { ConnectWalletPage } from './pages/ConnectWalletPage';
import { LandingPage } from './pages/LandingPage';
import { ProfilePage } from './pages/ProfilePage';
import { seedWelcomeScreenClosed } from './utils/welcomeScreen';

test.describe('Connect/disconnect MetaMask with Jumper and open /profile', () => {
  // JUM-1116: flaky in CI (6/15) — the real-MetaMask connect + post-connect Perks tab
  // (#profile-tabs-perks, ProfilePage.ts) intermittently doesn't settle on the CI runner.
  // Re-enable when the MetaMask connect/perks flow is stabilized for CI.
  test.fixme('Connect MetaMask wallet to Jumper', async ({ wallet }) => {
    const page = await wallet.getContext().newPage();
    await seedWelcomeScreenClosed(page);
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const landingPage = new LandingPage(page);
    const connectWalletPage = new ConnectWalletPage(page);
    const profilePage = new ProfilePage(page);

    await test.step('Connect MetaMask wallet to Jumper', async () => {
      await connectWalletPage.clickConnect();
      await connectWalletPage.expectSelectWalletDialogVisible();
      await connectWalletPage.selectWalletOption(WALLET_OPTIONS.METAMASK);
      await connectWalletPage.selectEcosystem(CHAINS.ETHEREUM);
      await wallet.connectInPopup(wallet.getContext());
    });

    await test.step('Navigate to profile', async () => {
      await profilePage.clickPassPrompt();
      await profilePage.expectVisible();
    });

    await test.step('Check Perks and Achievements tabs', async () => {
      await profilePage.openAchievementsTab();
      await profilePage.openPerksTab();
      await profilePage.expectPerksCards();
    });

    await test.step('Check transaction history', async () => {
      await landingPage.clickJumperLogo();
      await profilePage.openTransactionHistory();
      await profilePage.expectTransactionsPresent();
    });

    await test.step('Disconnect wallet from Jumper', async () => {
      await connectWalletPage.openConnectedWalletMenu();
      await connectWalletPage.expectDisconnectMenuVisible();
      await connectWalletPage.clickDisconnect();
      await connectWalletPage.expectDisconnected();
    });
  });
});
