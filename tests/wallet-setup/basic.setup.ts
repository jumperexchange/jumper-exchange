import type { BrowserContext, Page } from '@playwright/test'
import { defineWalletSetup } from '@synthetixio/synpress'
import { MetaMask } from '@synthetixio/synpress/playwright'

const SEED_PHRASE =
  'test test test test test test test test test test test junk';
const PASSWORD = 'SynpressIsAwesomeNow!!!';

export default defineWalletSetup(
  PASSWORD,
  async (context: BrowserContext, walletPage: Page) => {
    const metamask = new MetaMask(context, walletPage, PASSWORD)
    await metamask.importWallet(SEED_PHRASE);
  }
);
