import { EXTENSION_NAME } from '../constants/extensionConstants';
import MetaMaskPage from '../pages/MetaMaskPage';

import type { WalletCreationResult } from '../types';
import type { WalletStrategy } from './WalletStrategy';

/**
 * Strategy for creating MetaMask wallet instances.
 */
export default class MetamaskStrategy implements WalletStrategy {
  /**
   * Wallet type identifier.
   */
  readonly type = EXTENSION_NAME.METAMASK;

  /**
   * Creates a MetaMask wallet and its browser context.
   */
  async createWallet(): Promise<WalletCreationResult> {
    const { context, page } = await MetaMaskPage.initialize();
    return {
      context,
      wallet: new MetaMaskPage(page),
    };
  }
}
