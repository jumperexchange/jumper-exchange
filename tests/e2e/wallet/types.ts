import type { EXTENSION_NAME } from './constants/extensionConstants';
import type WalletPage from './pages/core/WalletPage';
import type { WalletSelectors } from './pages/core/WalletPage';
import type { BrowserContext } from '@playwright/test';

export interface WalletCreationResult {
  context: BrowserContext;
  wallet: WalletPage<WalletSelectors>;
}

export type WalletType = (typeof EXTENSION_NAME)[keyof typeof EXTENSION_NAME];
