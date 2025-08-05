import { WalletMethods } from './types';

// Whitelist of methods that don't require biconomy clients or extra params
export const NO_DEPS_METHODS = new Set([WalletMethods.getCapabilities]);

export const NO_ROUTE_ID_SUFFIX = 'no-route';
