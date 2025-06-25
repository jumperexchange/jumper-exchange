import { PublicKey } from '@solana/web3.js';
import { isAddress } from 'viem';
import {
  isValidSolanaAddress,
  isValidSuiAddress,
  isValidUTXOAddress,
} from '../regex-patterns';

// Helper function to sanitize numeric values
export function sanitizeNumeric(value: string): string {
  // Remove any non-numeric characters except decimal point
  return value.replace(/[^\d.]/g, '');
}

// Helper function to sanitize address
export const sanitizeAddress = (address: string): string => {
  if (!address) {
    throw new Error('Address is required');
  }

  // Remove any whitespace and convert to lowercase
  const trimmedAddress = address.trim();
  const cleanAddress = trimmedAddress.toLowerCase();

  // First do preliminary format checks for better error messages
  if (cleanAddress.startsWith('0x')) {
    // Check if it's a valid Ethereum address
    if (isAddress(trimmedAddress)) {
      return trimmedAddress;
    }
    // Check if it's a valid SUI address
    if (isValidSuiAddress(trimmedAddress)) {
      return trimmedAddress;
    }
    throw new Error('Invalid Ethereum or SUI address');
  }

  // Check if it's a valid Solana address - case sensitive!
  if (isValidSolanaAddress(trimmedAddress)) {
    try {
      const pubKey = new PublicKey(trimmedAddress);
      return pubKey.toString();
    } catch (e) {
      throw new Error('Invalid Solana address');
    }
  }

  // Check if it's a valid UTXO address
  if (isValidUTXOAddress(trimmedAddress)) {
    return trimmedAddress;
  }

  // Generic error for other cases
  throw new Error(
    'Invalid address: Must be a valid Ethereum, Solana, UTXO, or SUI address',
  );
};
