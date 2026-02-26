/**
 * BIP-39 mnemonic generation and wallet derivation.
 *
 * Uses viem (already installed, tree-shakeable, wagmi-native) which
 * delegates to @scure/bip39 and @scure/bip32 (audited by Trail of Bits).
 */
import { entropyToMnemonic, mnemonicToEntropy } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english.js';
import { english, generateMnemonic, mnemonicToAccount } from 'viem/accounts';
import type { GeneratedWallet } from './types';

const MNEMONIC_STRENGTH = 256; // 24 words

/**
 * Generate a new 24-word BIP-39 mnemonic and derive an EVM wallet.
 * Uses crypto.getRandomValues() internally for entropy.
 */
export function generateWallet(): GeneratedWallet {
  const mnemonic = generateMnemonic(english, MNEMONIC_STRENGTH);
  return walletFromMnemonic(mnemonic);
}

/**
 * Reconstruct a wallet from an existing mnemonic phrase.
 */
export function walletFromMnemonic(mnemonic: string): GeneratedWallet {
  const account = mnemonicToAccount(mnemonic);
  const entropy = mnemonicPhraseToEntropy(mnemonic);

  return {
    mnemonic,
    entropy,
    address: account.address,
    publicKey: account.publicKey,
  };
}

/**
 * Validate a BIP-39 mnemonic phrase.
 * Checks word count, word validity, and checksum.
 */
export function validateMnemonic(phrase: string): boolean {
  try {
    const normalized = phrase.trim().split(/\s+/).join(' ');
    const words = normalized.split(' ');
    if (words.length !== 24) {
      return false;
    }
    mnemonicToEntropy(normalized, wordlist);
    return true;
  } catch {
    return false;
  }
}

/**
 * Convert a mnemonic phrase to its raw 32-byte entropy.
 * Used for Shamir's Secret Sharing (operates on bytes, not strings).
 */
export function mnemonicPhraseToEntropy(mnemonic: string): Uint8Array {
  return mnemonicToEntropy(mnemonic, wordlist);
}

/**
 * Convert raw entropy back to a mnemonic phrase.
 * Used after SSS reconstruction.
 */
export function entropyToMnemonicPhrase(entropy: Uint8Array): string {
  return entropyToMnemonic(entropy, wordlist);
}
