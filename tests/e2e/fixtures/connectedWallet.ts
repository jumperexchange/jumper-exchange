import { CHAINS, WALLET_OPTIONS } from '../data';
import { ConnectWalletPage, LandingPage } from '../pages';
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
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await use(page);
    await page.close();
  },

  landingPage: async ({ jumperPage }, use) => {
    await use(new LandingPage(jumperPage));
  },

  // The connect step itself: fixture-scoped so every test that uses
  // connectedTest starts already wallet-connected and can focus on its actual
  // assertions. Specs that test the connect flow itself (connectWallet.spec)
  // use realWalletTest instead.
  walletConnected: [
    async ({ connectWalletPage, landingPage, wallet, walletContext }, use) => {
      await landingPage.closeWelcomeScreen();
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

export { expect } from '@playwright/test';
