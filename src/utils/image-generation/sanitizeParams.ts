import { PublicKey } from '@solana/web3.js';
import { isAddress } from 'viem';

// Helper function to sanitize numeric values
export function sanitizeNumeric(value: string): string {
  // Remove any non-numeric characters except decimal point
  return value.replace(/[^\d.]/g, '');
}

export function sanitizeTheme(theme: string): 'light' | 'dark' {
  return theme === 'dark' ? 'dark' : 'light';
}

// export function sanitizeHighlighted(
//   value?: string,
// ): HighlightedAreas | undefined {
//   // Only allow valid highlighted values
//   if (!value) {
//     return undefined;
//   }
//   const validValues = ['from', 'to', 'amount', '0', '1', '2'];
//   return validValues.includes(value) ? value : '0';
// }

// Helper function to sanitize address
export const sanitizeAddress = (address: string): string => {
  if (!address) {
    throw new Error('Address is required');
  }

  // Remove any whitespace and convert to lowercase
  const cleanAddress = address.trim().toLowerCase();

  // Check if it's a valid Ethereum address
  if (isAddress(cleanAddress)) {
    return cleanAddress;
  }

  // Check if it's a valid Solana address - case sensitive!
  try {
    // Use the original trimmed address (not lowercase) for Solana
    const originalTrimmed = address.trim();
    const pubKey = new PublicKey(originalTrimmed);
    return pubKey.toString();
  } catch (e) {
    // Not a valid Solana address
  }

  // Provide more specific error messages for common issues
  if (/^0x[a-f0-9]*$/i.test(cleanAddress) && cleanAddress.length !== 42) {
    // Checks if string has 0x prefix and hex characters but not exactly 42 chars (standard ETH address length)
    throw new Error('Invalid Ethereum address: incorrect length');
  }

  if (
    /^[1-9A-HJ-NP-Za-km-z]*$/.test(cleanAddress) &&
    (cleanAddress.length < 32 || cleanAddress.length > 44)
  ) {
    // Checks if string has valid Base58 characters but invalid length for Solana addresses
    throw new Error('Invalid Solana address: incorrect length');
  }

  // Generic error for other cases
  throw new Error(
    'Invalid address: Must be a valid Ethereum or Solana address',
  );
};
