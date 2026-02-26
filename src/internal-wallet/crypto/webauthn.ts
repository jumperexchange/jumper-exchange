/**
 * WebAuthn biometric authentication for the Jumper Internal Wallet.
 *
 * Primary path: WebAuthn PRF extension (hardware-bound key derivation).
 *   PRF returns deterministic 32-byte output from authenticator hardware,
 *   which is fed through HKDF-SHA-256 to derive an AES-256-GCM key for
 *   encrypting/decrypting the mnemonic.
 *
 * Fallback path: WebAuthn as gate (proof of presence) + wrapped key pattern.
 *   Biometric auth verifies user presence; the calling code manages a session
 *   key stored in IndexedDB that decrypts the mnemonic key.
 */
import type { WebAuthnCredentialInfo } from './types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const RP_NAME = 'Jumper Exchange';
const CREDENTIAL_TIMEOUT = 60_000; // 1 minute
const PRF_SALT_PURPOSE = 'jumper-wallet-prf-v1';

const IV_LENGTH = 12; // 96-bit nonce for AES-GCM
const PBKDF2_ITERATIONS = 600_000;
const WRAP_SALT_LENGTH = 16; // 128-bit salt for password wrapping

// ---------------------------------------------------------------------------
// Base64url helpers (no external dependencies)
// ---------------------------------------------------------------------------

function toBase64Url(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function fromBase64Url(b64url: string) {
  const base64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function toBase64(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function fromBase64(b64: string) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Derive a user ID from the wallet address via SHA-256.
 * WebAuthn user.id must be 1-64 bytes; SHA-256 gives us 32 bytes.
 */
async function userIdFromAddress(walletAddress: string) {
  const encoder = new TextEncoder();
  const hash = await crypto.subtle.digest(
    'SHA-256',
    encoder.encode(walletAddress),
  );
  return new Uint8Array(hash);
}

/**
 * Compute the PRF eval salt from the wallet address.
 * SHA-256( PRF_SALT_PURPOSE + walletAddress ) -> 32-byte salt.
 */
async function computePRFSalt(walletAddress: string) {
  const encoder = new TextEncoder();
  const hash = await crypto.subtle.digest(
    'SHA-256',
    encoder.encode(PRF_SALT_PURPOSE + walletAddress),
  );
  return new Uint8Array(hash);
}

/**
 * Derive an AES-256-GCM key from raw PRF output via HKDF-SHA-256.
 * The resulting key is non-extractable.
 */
async function deriveAESKeyFromPRF(prfOutput: ArrayBuffer): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    prfOutput,
    'HKDF',
    false,
    ['deriveKey'],
  );

  const encoder = new TextEncoder();
  return crypto.subtle.deriveKey(
    {
      name: 'HKDF',
      hash: 'SHA-256',
      salt: new Uint8Array(32), // fixed empty salt (PRF output is already keyed)
      info: encoder.encode('jumper-wallet-aes-key-v1'),
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false, // non-extractable
    ['encrypt', 'decrypt'],
  );
}

/**
 * Derive an AES-256-GCM wrapping key from a password and salt via PBKDF2.
 */
async function deriveWrappingKey(
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
    { name: 'AES-GCM', length: 256 },
    false, // non-extractable
    ['wrapKey', 'unwrapKey'],
  );
}

// ---------------------------------------------------------------------------
// WebAuthn availability checks
// ---------------------------------------------------------------------------

/**
 * Check if WebAuthn is available in the current browser.
 */
export function isWebAuthnAvailable(): boolean {
  return (
    typeof window !== 'undefined' &&
    !!window.PublicKeyCredential &&
    typeof window.PublicKeyCredential
      .isUserVerifyingPlatformAuthenticatorAvailable === 'function'
  );
}

/**
 * Check if the browser supports the PRF extension.
 * Uses the static method getClientCapabilities (where available) or falls
 * back to a trial credential creation to detect PRF support.
 */
export async function isPRFSupported(): Promise<boolean> {
  if (!isWebAuthnAvailable()) {
    return false;
  }

  // Preferred: use PublicKeyCredential.getClientCapabilities if available
  // (Chrome 132+, Safari 18.4+)
  if (
    'getClientCapabilities' in PublicKeyCredential &&
    typeof (PublicKeyCredential as any).getClientCapabilities === 'function'
  ) {
    try {
      const capabilities = await (
        PublicKeyCredential as any
      ).getClientCapabilities();
      // Chrome uses "extension:prf" (colon), not "extension_prf" (underscore)
      const prfCap =
        capabilities?.['extension:prf'] ?? capabilities?.extension_prf;
      if (typeof prfCap === 'boolean') {
        return prfCap;
      }
    } catch {
      // Fall through to feature detection
    }
  }

  // Fallback: Check if PublicKeyCredential supports getClientExtensionResults
  // by inspecting the constructor. We cannot actually call create() without
  // user gesture, so we do a best-effort check based on known browser versions.
  // The caller must handle the case where PRF is not available at create time.
  try {
    const available =
      await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    if (!available) {
      return false;
    }
    // If getClientCapabilities is not available, we assume PRF *might* be
    // available and let the actual registration determine it.
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

/**
 * Register a new WebAuthn credential for biometric login.
 * Returns credential info and whether PRF is supported.
 *
 * @param walletAddress - The wallet address to associate with this credential
 * @param userName - Display name for the credential (e.g., "Jumper Account")
 */
export async function registerWebAuthnCredential(
  walletAddress: string,
  userName: string,
): Promise<{
  credential: WebAuthnCredentialInfo;
  prfKey?: CryptoKey;
}> {
  if (!isWebAuthnAvailable()) {
    throw new Error('WebAuthn is not available in this browser');
  }

  const userId = await userIdFromAddress(walletAddress);
  const prfSalt = await computePRFSalt(walletAddress);

  const publicKeyOptions: PublicKeyCredentialCreationOptions = {
    challenge: crypto.getRandomValues(new Uint8Array(32)),
    rp: {
      name: RP_NAME,
      id: window.location.hostname,
    },
    user: {
      id: userId,
      name: userName,
      displayName: userName,
    },
    pubKeyCredParams: [
      { alg: -7, type: 'public-key' }, // ES256
      { alg: -257, type: 'public-key' }, // RS256
    ],
    authenticatorSelection: {
      userVerification: 'required',
      residentKey: 'preferred',
      requireResidentKey: false,
    },
    timeout: CREDENTIAL_TIMEOUT,
    extensions: {
      prf: {
        eval: {
          first: prfSalt,
        },
      },
    } as AuthenticationExtensionsClientInputs,
  };

  const created = (await navigator.credentials.create({
    publicKey: publicKeyOptions,
  })) as PublicKeyCredential | null;

  if (!created) {
    throw new Error('WebAuthn credential creation was cancelled');
  }

  const credentialId = toBase64Url(created.rawId);

  const extensionResults = created.getClientExtensionResults() as any;

  const prfEnabled =
    extensionResults?.prf?.enabled === true ||
    extensionResults?.prf?.results?.first != null;

  let prfKey: CryptoKey | undefined;

  if (prfEnabled && extensionResults?.prf?.results?.first) {
    // PRF returned output during registration — derive AES key
    prfKey = await deriveAESKeyFromPRF(extensionResults.prf.results.first);
  }

  const credentialInfo: WebAuthnCredentialInfo = {
    credentialId,
    prfSupported: prfEnabled,
    createdAt: new Date().toISOString(),
  };

  return {
    credential: credentialInfo,
    prfKey,
  };
}

// ---------------------------------------------------------------------------
// Authentication: PRF path
// ---------------------------------------------------------------------------

/**
 * Authenticate with WebAuthn and derive decryption key (PRF path).
 * Returns a non-extractable CryptoKey that can decrypt the mnemonic.
 *
 * @param credentialId - Base64url credential ID from registration
 * @param salt - Application-specific salt (use computePRFSalt with wallet address)
 */
export async function authenticateWithPRF(
  credentialId: string,
  salt: Uint8Array,
): Promise<CryptoKey> {
  if (!isWebAuthnAvailable()) {
    throw new Error('WebAuthn is not available in this browser');
  }

  const allowCredentials: PublicKeyCredentialDescriptor[] = [
    {
      type: 'public-key',
      id: fromBase64Url(credentialId),
    },
  ];

  const assertion = (await navigator.credentials.get({
    publicKey: {
      challenge: crypto.getRandomValues(new Uint8Array(32)),
      allowCredentials,
      userVerification: 'required',
      timeout: CREDENTIAL_TIMEOUT,
      rpId: window.location.hostname,
      extensions: {
        prf: {
          eval: {
            first: salt,
          },
        },
      } as AuthenticationExtensionsClientInputs,
    },
  })) as PublicKeyCredential | null;

  if (!assertion) {
    throw new Error('WebAuthn authentication was cancelled');
  }

  const extensionResults = assertion.getClientExtensionResults() as any;
  console.log('bio, login', extensionResults);
  const prfResult = extensionResults?.prf?.results?.first;

  if (!prfResult) {
    throw new Error(
      'PRF extension did not return output. The authenticator may not support PRF.',
    );
  }

  return deriveAESKeyFromPRF(prfResult);
}

// ---------------------------------------------------------------------------
// Authentication: fallback (gate-only) path
// ---------------------------------------------------------------------------

/**
 * Authenticate with WebAuthn (fallback path - gate only).
 * Just verifies the user is present via biometric. The calling code must handle
 * the actual decryption key management.
 *
 * @param credentialId - Base64url credential ID from registration
 */
export async function authenticateWithWebAuthn(
  credentialId: string,
): Promise<boolean> {
  if (!isWebAuthnAvailable()) {
    return false;
  }

  const allowCredentials: PublicKeyCredentialDescriptor[] = [
    {
      type: 'public-key',
      id: fromBase64Url(credentialId),
    },
  ];

  try {
    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge: crypto.getRandomValues(new Uint8Array(32)),
        allowCredentials,
        userVerification: 'required',
        timeout: CREDENTIAL_TIMEOUT,
        rpId: window.location.hostname,
      },
    });

    return assertion !== null;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// PRF-path encryption / decryption
// ---------------------------------------------------------------------------

/**
 * Encrypt data with a PRF-derived key.
 * Used to store the mnemonic encrypted with biometric-derived key.
 */
export async function encryptWithPRFKey(
  data: string,
  prfKey: CryptoKey,
): Promise<{ iv: string; ct: string }> {
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    prfKey,
    encoder.encode(data),
  );

  return {
    iv: toBase64(iv),
    ct: toBase64(ciphertext),
  };
}

/**
 * Decrypt data with a PRF-derived key.
 */
export async function decryptWithPRFKey(
  encrypted: { iv: string; ct: string },
  prfKey: CryptoKey,
): Promise<string> {
  const iv = fromBase64(encrypted.iv);
  const ct = fromBase64(encrypted.ct);

  try {
    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      prfKey,
      ct,
    );

    return new TextDecoder().decode(plaintext);
  } catch {
    throw new Error(
      'Biometric decryption failed: key mismatch or corrupted data',
    );
  }
}

// ---------------------------------------------------------------------------
// Fallback path: wrapped key helpers
// ---------------------------------------------------------------------------

/**
 * Create a wrapped key for the fallback path.
 * Generates a random AES-256 unlock key, encrypts it with the password-derived
 * wrapping key, and returns the encrypted form. During biometric auth, a session
 * key stored in IndexedDB is used to wrap/unwrap this unlock key.
 *
 * @param password - User password to derive the wrapping key from
 */
export async function createWrappedKey(password: string): Promise<{
  wrappedKey: string;
  salt: string;
}> {
  const salt = crypto.getRandomValues(new Uint8Array(WRAP_SALT_LENGTH));
  const wrappingKey = await deriveWrappingKey(password, salt);

  // Generate the random unlock key that will be used for mnemonic encryption
  const unlockKey = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true, // must be extractable for wrapping
    ['encrypt', 'decrypt'],
  );

  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

  // Wrap (encrypt) the unlock key with the password-derived wrapping key
  const wrapped = await crypto.subtle.wrapKey('raw', unlockKey, wrappingKey, {
    name: 'AES-GCM',
    iv,
  });

  // Concatenate iv + wrapped key for storage
  const combined = new Uint8Array(IV_LENGTH + wrapped.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(wrapped), IV_LENGTH);

  return {
    wrappedKey: toBase64(combined),
    salt: toBase64(salt),
  };
}

/**
 * Unwrap the key using a password (for fallback verification).
 * Returns a non-extractable CryptoKey that can be used for encrypt/decrypt.
 *
 * @param wrappedKey - Base64 encoded iv + wrapped key from createWrappedKey
 * @param salt - Base64 encoded salt from createWrappedKey
 * @param password - User password
 */
export async function unwrapKeyWithPassword(
  wrappedKey: string,
  salt: string,
  password: string,
): Promise<CryptoKey> {
  const combined = fromBase64(wrappedKey);
  const saltBytes = fromBase64(salt);

  if (combined.length <= IV_LENGTH) {
    throw new Error('Invalid wrapped key: data too short');
  }

  const iv = combined.slice(0, IV_LENGTH);
  const wrapped = combined.slice(IV_LENGTH);

  const wrappingKey = await deriveWrappingKey(password, saltBytes);

  try {
    return await crypto.subtle.unwrapKey(
      'raw',
      wrapped,
      wrappingKey,
      { name: 'AES-GCM', iv },
      { name: 'AES-GCM', length: 256 },
      false, // non-extractable
      ['encrypt', 'decrypt'],
    );
  } catch {
    throw new Error('Key unwrap failed: incorrect password or corrupted data');
  }
}

// ---------------------------------------------------------------------------
// Utility exports (useful for callers)
// ---------------------------------------------------------------------------

/**
 * Compute the PRF salt for a given wallet address.
 * Exported so callers can pass it to authenticateWithPRF.
 */
export { computePRFSalt };
