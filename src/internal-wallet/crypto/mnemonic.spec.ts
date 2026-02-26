import { describe, expect, it } from 'vitest';
import {
  entropyToMnemonicPhrase,
  generateWallet,
  mnemonicPhraseToEntropy,
  validateMnemonic,
  walletFromMnemonic,
} from './mnemonic';

describe('mnemonic', () => {
  describe('generateWallet', () => {
    it('generates a valid 24-word mnemonic', () => {
      const wallet = generateWallet();
      const words = wallet.mnemonic.split(' ');
      expect(words).toHaveLength(24);
    });

    it('generates a valid EVM address', () => {
      const wallet = generateWallet();
      expect(wallet.address).toMatch(/^0x[0-9a-fA-F]{40}$/);
    });

    it('generates 32-byte entropy', () => {
      const wallet = generateWallet();
      expect(wallet.entropy).toHaveLength(32);
      expect(wallet.entropy).toBeInstanceOf(Uint8Array);
    });

    it('generates unique wallets on each call', () => {
      const w1 = generateWallet();
      const w2 = generateWallet();
      expect(w1.mnemonic).not.toBe(w2.mnemonic);
      expect(w1.address).not.toBe(w2.address);
    });
  });

  describe('walletFromMnemonic', () => {
    it('derives the same address from the same mnemonic', () => {
      const wallet = generateWallet();
      const restored = walletFromMnemonic(wallet.mnemonic);
      expect(restored.address).toBe(wallet.address);
      expect(restored.publicKey).toBe(wallet.publicKey);
    });

    it('derives the same entropy from the same mnemonic', () => {
      const wallet = generateWallet();
      const restored = walletFromMnemonic(wallet.mnemonic);
      expect(restored.entropy).toEqual(wallet.entropy);
    });
  });

  describe('validateMnemonic', () => {
    it('returns true for a valid 24-word mnemonic', () => {
      const wallet = generateWallet();
      expect(validateMnemonic(wallet.mnemonic)).toBe(true);
    });

    it('returns false for a 12-word mnemonic', () => {
      // Valid 12-word mnemonic but we require 24
      const twelveWords =
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
      expect(validateMnemonic(twelveWords)).toBe(false);
    });

    it('returns false for random words', () => {
      expect(
        validateMnemonic(
          'hello world foo bar baz qux one two three four five six',
        ),
      ).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(validateMnemonic('')).toBe(false);
    });

    it('handles extra whitespace', () => {
      const wallet = generateWallet();
      const paddedMnemonic = `  ${wallet.mnemonic}  `;
      expect(validateMnemonic(paddedMnemonic)).toBe(true);
    });
  });

  describe('entropy round-trip', () => {
    it('converts mnemonic → entropy → mnemonic losslessly', () => {
      const wallet = generateWallet();
      const entropy = mnemonicPhraseToEntropy(wallet.mnemonic);
      const restored = entropyToMnemonicPhrase(entropy);
      expect(restored).toBe(wallet.mnemonic);
    });

    it('entropy is always 32 bytes for 24-word mnemonics', () => {
      for (let i = 0; i < 5; i++) {
        const wallet = generateWallet();
        const entropy = mnemonicPhraseToEntropy(wallet.mnemonic);
        expect(entropy).toHaveLength(32);
      }
    });
  });
});
