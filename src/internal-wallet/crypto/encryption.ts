/**
 * Password-based encryption using Web Crypto API.
 *
 * Key derivation: PBKDF2-SHA-256 with 600,000 iterations (OWASP 2023).
 * Encryption: AES-256-GCM with random 12-byte IV.
 * All operations use native SubtleCrypto — no external crypto dependencies.
 */
import type { EncryptedBlob } from './types';

const PBKDF2_ITERATIONS = 600_000;
const SALT_LENGTH = 16; // 128 bits
const IV_LENGTH = 12; // 96 bits (standard for AES-GCM)
const KEY_LENGTH = 256; // AES-256

// --- Base64 Helpers ---

function toBase64(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function fromBase64(b64: string) {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

// --- Key Derivation ---

async function deriveKey(
  password: string,
  salt: Uint8Array<ArrayBuffer>,
): Promise<CryptoKey> {
  const encoder = new TextEncoder();

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey'],
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: KEY_LENGTH },
    false, // non-extractable
    ['encrypt', 'decrypt'],
  );
}

// --- Encrypt ---

export async function encryptMnemonic(
  mnemonic: string,
  password: string,
  evmAddress: string,
): Promise<EncryptedBlob> {
  const encoder = new TextEncoder();

  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH)).slice();
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH)).slice();

  const key = await deriveKey(password, salt);

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(mnemonic),
  );

  return {
    v: 1,
    alg: 'PBKDF2-SHA256-AES256GCM',
    iter: PBKDF2_ITERATIONS,
    salt: toBase64(salt.buffer),
    iv: toBase64(iv.buffer),
    ct: toBase64(ciphertext),
    addr: evmAddress,
  };
}

// --- Decrypt ---

/**
 * Decrypt an encrypted mnemonic blob with a user password.
 * Throws on wrong password (AES-GCM auth tag mismatch).
 */
export async function decryptMnemonic(
  blob: EncryptedBlob,
  password: string,
): Promise<string> {
  if (blob.v !== 1) {
    throw new Error(`Unsupported encryption version: ${blob.v}`);
  }

  const salt = fromBase64(blob.salt);
  const iv = fromBase64(blob.iv);
  const ct = fromBase64(blob.ct);

  const key = await deriveKey(password, salt);

  try {
    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ct,
    );

    return new TextDecoder().decode(plaintext);
  } catch {
    throw new Error('Decryption failed: incorrect password or corrupted data');
  }
}
