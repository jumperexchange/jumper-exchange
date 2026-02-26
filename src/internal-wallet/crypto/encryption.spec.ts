import { describe, expect, it } from 'vitest';
import { decryptMnemonic, encryptMnemonic } from './encryption';

const TEST_MNEMONIC =
  'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art';
const TEST_PASSWORD = 'MySecureP@ssw0rd!';
const TEST_ADDRESS = '0x1234567890abcdef1234567890abcdef12345678';

describe('encryption', () => {
  describe('encryptMnemonic', () => {
    it('returns a valid EncryptedBlob', async () => {
      const blob = await encryptMnemonic(
        TEST_MNEMONIC,
        TEST_PASSWORD,
        TEST_ADDRESS,
      );

      expect(blob.v).toBe(1);
      expect(blob.alg).toBe('PBKDF2-SHA256-AES256GCM');
      expect(blob.iter).toBe(600_000);
      expect(blob.salt).toBeTruthy();
      expect(blob.iv).toBeTruthy();
      expect(blob.ct).toBeTruthy();
      expect(blob.addr).toBe(TEST_ADDRESS);
    });

    it('generates different salt/iv on each call', async () => {
      const blob1 = await encryptMnemonic(
        TEST_MNEMONIC,
        TEST_PASSWORD,
        TEST_ADDRESS,
      );
      const blob2 = await encryptMnemonic(
        TEST_MNEMONIC,
        TEST_PASSWORD,
        TEST_ADDRESS,
      );

      expect(blob1.salt).not.toBe(blob2.salt);
      expect(blob1.iv).not.toBe(blob2.iv);
      expect(blob1.ct).not.toBe(blob2.ct);
    });
  });

  describe('decryptMnemonic', () => {
    it('round-trips encrypt → decrypt successfully', async () => {
      const blob = await encryptMnemonic(
        TEST_MNEMONIC,
        TEST_PASSWORD,
        TEST_ADDRESS,
      );
      const decrypted = await decryptMnemonic(blob, TEST_PASSWORD);
      expect(decrypted).toBe(TEST_MNEMONIC);
    });

    it('throws on wrong password', async () => {
      const blob = await encryptMnemonic(
        TEST_MNEMONIC,
        TEST_PASSWORD,
        TEST_ADDRESS,
      );

      await expect(decryptMnemonic(blob, 'WrongPassword123!')).rejects.toThrow(
        'Decryption failed',
      );
    });

    it('throws on tampered ciphertext', async () => {
      const blob = await encryptMnemonic(
        TEST_MNEMONIC,
        TEST_PASSWORD,
        TEST_ADDRESS,
      );

      // Tamper with the ciphertext
      const tampered = { ...blob, ct: blob.ct.slice(0, -4) + 'AAAA' };

      await expect(decryptMnemonic(tampered, TEST_PASSWORD)).rejects.toThrow(
        'Decryption failed',
      );
    });

    it('handles unicode mnemonic content', async () => {
      // While BIP-39 uses ASCII, test that the encryption layer handles unicode
      const unicodeContent = 'test content with unicode: \u00e9\u00e0\u00fc';
      const blob = await encryptMnemonic(
        unicodeContent,
        TEST_PASSWORD,
        TEST_ADDRESS,
      );
      const decrypted = await decryptMnemonic(blob, TEST_PASSWORD);
      expect(decrypted).toBe(unicodeContent);
    });
  });
});
