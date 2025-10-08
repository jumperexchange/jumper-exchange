import { WalletMethod } from './types';

// Whitelist of methods that don't require biconomy clients or extra params
export const NO_DEPS_METHODS = new Set<WalletMethod>([
  'wallet_getCapabilities',
]);

export const abiNumericTypes = [
  'uint256',
  'uint128',
  'uint64',
  'uint32',
  'uint16',
  'uint8',
  'int256',
  'int128',
  'int64',
  'int32',
  'int16',
  'int8',
];

export const TIMEOUT_IN_MINUTES = 2;
