import { CHAINS, WALLET_OPTIONS } from '../data/urls';
import { ConnectWalletPage } from '../pages/ConnectWalletPage';
import { LandingPage } from '../pages/LandingPage';
import { seedWelcomeScreenClosed } from '../utils/welcomeScreen';
import { realWalletTest } from './realWallet';

import type { Page } from '@playwright/test';

interface ConnectedWalletFixtures {
  connectWalletPage: ConnectWalletPage;
  jumperPage: Page;
  landingPage: LandingPage;
  walletConnected: void;
}

export const connectedTest = realWalletTest.extend<ConnectedWalletFixtures>({
  connectWalletPage: async ({ jumperPage }, use) => {
    await use(new ConnectWalletPage(jumperPage));
  },

  jumperPage: async ({ walletContext }, use) => {
    const page = await walletContext.newPage();
    await seedWelcomeScreenClosed(page);
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await use(page);
    await page.close();
  },

  landingPage: async ({ jumperPage }, use) => {
    await use(new LandingPage(jumperPage));
  },

  // Auto-runs the connect flow before each test. For specs that test connect itself, use realWalletTest.
  walletConnected: [
    async ({ connectWalletPage, wallet, walletContext }, use) => {
      await connectWalletPage.clickConnect();
      await connectWalletPage.expectSelectWalletDialogVisible();
      await connectWalletPage.selectWalletOption(WALLET_OPTIONS.METAMASK);
      await connectWalletPage.selectEcosystem(CHAINS.ETHEREUM);
      await wallet.connectInPopup(walletContext);
      await use();
    },
    { auto: true },
  ],
});
