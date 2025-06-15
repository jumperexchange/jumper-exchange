/**
 * Centralized regex patterns for blockchain address and transaction validation
 * This file contains all the regex patterns used across the codebase to avoid duplication
 */

// Ethereum/EVM patterns
export const ETHEREUM_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;
export const ETHEREUM_TRANSACTION_REGEX = /^0x[a-f0-9]{64}$/;
export const ETHEREUM_HEX_REGEX = /^0x[a-f0-9]*$/i;

// Solana patterns
export const SOLANA_ADDRESS_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
export const SOLANA_TRANSACTION_REGEX = /^[1-9A-HJ-NP-Za-km-z]{88}$/;

// Bitcoin patterns
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

// // Combined validation functions
// export const isValidAddress = (address: string): boolean => {
//   return (
//     isValidEthereumAddress(address) ||
//     isValidSolanaAddress(address) ||
//     isValidUTXOAddress(address)
//   );
// };

// export const isValidTransaction = (txHash: string): boolean => {
//   return (
//     isValidEthereumTransaction(txHash) ||
//     isValidSolanaTransaction(txHash) ||
//     isValidUTXOTransaction(txHash)
//   );
// };
