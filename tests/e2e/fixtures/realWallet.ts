import { test as base } from '@playwright/test';

import { EXTENSION_NAME } from '../wallet/constants/extensionConstants';
import WalletFactory from '../wallet/factory/WalletFactory';

import type MetaMaskPage from '../wallet/pages/MetaMaskPage';
import type { BrowserContext } from '@playwright/test';

interface RealWalletFixtures {
  wallet: MetaMaskPage;
  walletContext: BrowserContext;
  walletImported: void;
}

export const realWalletTest = base.extend<RealWalletFixtures>({
  wallet: async ({}, use) => {
    const { context, wallet } = await WalletFactory.createWallet(
      EXTENSION_NAME.METAMASK,
    );
    await use(wallet as MetaMaskPage);
    await context.close();
  },

  walletContext: async ({ wallet }, use) => {
    await use(wallet.getContext());
  },

  walletImported: [
    async ({ wallet }, use) => {
      const seed = process.env.TEST_WALLET_SEED_PHRASE;
      const password = process.env.TEST_WALLET_PASSWORD;
      if (!seed || !password) {
        throw new Error(
          'TEST_WALLET_SEED_PHRASE and TEST_WALLET_PASSWORD must be set (tests/.env.test or CI secrets).',
        );
      }
      await wallet.importWallet(seed, password);
      await use();
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';
