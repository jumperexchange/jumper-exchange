/**
 * Centralized regex patterns for blockchain address and transaction validation
 * This file contains all the regex patterns used across the codebase to avoid duplication
 */

import {
  isValidSuiAddress as suiAddressValidator,
  isValidTransactionDigest as suiTransactionValidator,
} from '@mysten/sui/utils';

// Ethereum/EVM patterns
export const ETHEREUM_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
export const ETHEREUM_TRANSACTION_REGEX = /^0x[a-f0-9]{64}$/;

// Solana patterns
export const SOLANA_ADDRESS_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
export const SOLANA_TRANSACTION_REGEX = /^[1-9A-HJ-NP-Za-km-z]{88}$/;

// Bitcoin/UTXO patterns
export const UTXO_ADDRESS_REGEX = /^(1|3|bc1)[a-zA-HJ-NP-Z0-9]{25,39}$/;
export const UTXO_TRANSACTION_REGEX = /^[a-fA-F0-9]{64}$/;

// Helper functions for validation
export const isValidEthereumAddress = (address: string): boolean => {
  return ETHEREUM_ADDRESS_REGEX.test(address);
};

export const isValidEthereumTransaction = (txHash: string): boolean => {
  return ETHEREUM_TRANSACTION_REGEX.test(txHash.toLowerCase());
};

export const isValidSolanaAddress = (address: string): boolean => {
  return SOLANA_ADDRESS_REGEX.test(address);
};

export const isValidSolanaTransaction = (txHash: string): boolean => {
  return SOLANA_TRANSACTION_REGEX.test(txHash);
};

export const isValidUTXOAddress = (address: string): boolean => {
  return UTXO_ADDRESS_REGEX.test(address);
};

export const isValidUTXOTransaction = (txHash: string): boolean => {
  return UTXO_TRANSACTION_REGEX.test(txHash);
};

export const isValidSuiAddress = (address: string): boolean => {
  try {
    return suiAddressValidator(address);
  } catch {
    return false;
  }
};

export const isValidSuiTransaction = (txHash: string): boolean => {
  try {
    return suiTransactionValidator(txHash);
  } catch {
    return false;
  }
};

// Combined validation functions
export const isValidAddress = (address: string): boolean => {
  return (
    isValidEthereumAddress(address) ||
    isValidSolanaAddress(address) ||
    isValidUTXOAddress(address) ||
    isValidSuiAddress(address)
  );
};

export const isValidTransaction = (txHash: string): boolean => {
  return (
    isValidEthereumTransaction(txHash) ||
    isValidSolanaTransaction(txHash) ||
    isValidUTXOTransaction(txHash) ||
    isValidSuiTransaction(txHash)
  );
};

// Address type detection
// export type AddressType = 'EVM' | 'SVM' | 'UTXO' | 'SUI' | 'UNKNOWN';

// export const getAddressType = (address: string): AddressType => {
//   if (isValidEthereumAddress(address)) return 'EVM';
//   if (isValidSolanaAddress(address)) return 'SVM';
//   if (isValidUTXOAddress(address)) return 'UTXO';
//   if (isValidSuiAddress(address)) return 'SUI';
//   return 'UNKNOWN';
// };

// export const getTransactionType = (txHash: string): AddressType => {
//   if (isValidEthereumTransaction(txHash)) return 'EVM';
//   if (isValidSolanaTransaction(txHash)) return 'SVM';
//   if (isValidUTXOTransaction(txHash)) return 'UTXO';
//   if (isValidSuiTransaction(txHash)) return 'SUI';
//   return 'UNKNOWN';
// };
