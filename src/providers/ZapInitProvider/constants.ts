import { WalletMethod } from './types';

// Whitelist of methods that don't require biconomy clients or extra params
export const NO_DEPS_METHODS = new Set<WalletMethod>([
  'wallet_getCapabilities',
]);
