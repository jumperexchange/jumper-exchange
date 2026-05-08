import { qase } from 'playwright-qase-reporter';

import { CHAINS, JUMPER_BUTTONS, WALLET_OPTIONS } from './data';
import { realWalletTest as test } from './fixtures';
import { ConnectWalletPage, LandingPage, ProfilePage } from './pages';

test.describe('Connect/disconnect MetaMask with Jumper and open /profile', () => {
  test(qase(36, 'Connect MetaMask wallet to Jumper'), async ({ wallet }) => {
    const page = await wallet.getContext().newPage();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const landingPage = new LandingPage(page);
    const connectWalletPage = new ConnectWalletPage(page);
    const profilePage = new ProfilePage(page);

    await test.step('Connect MetaMask wallet to Jumper', async () => {
      await landingPage.closeWelcomeScreen();
      await connectWalletPage.clickConnect();
      await connectWalletPage.expectSelectWalletDialogVisible();
      await connectWalletPage.selectWalletOption(WALLET_OPTIONS.METAMASK);
      await connectWalletPage.selectEcosystem(CHAINS.ETHEREUM);
      await wallet.connectInPopup(wallet.getContext());
    });

    await test.step('Navigate to profile', async () => {
      await page.getByRole('button', { name: JUMPER_BUTTONS.PASS }).click();
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
