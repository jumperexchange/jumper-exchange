/**
 * IndexedDB wrapper for the Jumper Internal Wallet.
 *
 * Uses IndexedDB (not localStorage) for:
 * - Transactional integrity (prevents partial writes/corruption)
 * - Binary data support (Uint8Array, Blob)
 * - Web Worker accessibility (future crypto offloading)
 */
import type { StoredWallet, RemoteShareMetadata } from './types';

const DB_NAME = 'jumper-internal-wallet';
const DB_VERSION = 1;
const WALLETS_STORE = 'wallets';
const SHARE_METADATA_STORE = 'remote-share-metadata';

// --- Database Lifecycle ---

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(WALLETS_STORE)) {
        db.createObjectStore(WALLETS_STORE, { keyPath: 'address' });
      }

      if (!db.objectStoreNames.contains(SHARE_METADATA_STORE)) {
        const store = db.createObjectStore(SHARE_METADATA_STORE, {
          keyPath: ['address', 'location'],
        });
        store.createIndex('by-address', 'address', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// --- Wallet Operations ---

/**
 * Store a wallet record. Overwrites if the address already exists.
 */
export async function saveWallet(wallet: StoredWallet): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(WALLETS_STORE, 'readwrite');
    const store = tx.objectStore(WALLETS_STORE);
    const request = store.put(wallet);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

/**
 * Retrieve a wallet by its EVM address.
 */
export async function getWallet(
  address: string,
): Promise<StoredWallet | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(WALLETS_STORE, 'readonly');
    const store = tx.objectStore(WALLETS_STORE);
    const request = store.get(address);
    request.onsuccess = () =>
      resolve(request.result as StoredWallet | undefined);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

/**
 * Get all stored wallets.
 */
export async function getAllWallets(): Promise<StoredWallet[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(WALLETS_STORE, 'readonly');
    const store = tx.objectStore(WALLETS_STORE);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result as StoredWallet[]);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

/**
 * Delete a wallet by its EVM address.
 */
export async function deleteWallet(address: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(
      [WALLETS_STORE, SHARE_METADATA_STORE],
      'readwrite',
    );

    // Delete wallet record
    tx.objectStore(WALLETS_STORE).delete(address);

    // Delete associated share metadata
    const shareStore = tx.objectStore(SHARE_METADATA_STORE);
    const index = shareStore.index('by-address');
    const cursorReq = index.openCursor(IDBKeyRange.only(address));

    cursorReq.onsuccess = () => {
      const cursor = cursorReq.result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };

    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

// --- Share Metadata Operations ---

/**
 * Store metadata about a remotely-stored share.
 */
export async function saveShareMetadata(
  metadata: RemoteShareMetadata,
): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SHARE_METADATA_STORE, 'readwrite');
    const store = tx.objectStore(SHARE_METADATA_STORE);
    const request = store.put(metadata);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

/**
 * Get all share metadata for a given wallet address.
 */
export async function getShareMetadata(
  address: string,
): Promise<RemoteShareMetadata[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SHARE_METADATA_STORE, 'readonly');
    const store = tx.objectStore(SHARE_METADATA_STORE);
    const index = store.index('by-address');
    const request = index.getAll(address);
    request.onsuccess = () => resolve(request.result as RemoteShareMetadata[]);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

/**
 * Check if a wallet exists in the database.
 */
export async function walletExists(address: string): Promise<boolean> {
  const wallet = await getWallet(address);
  return wallet !== undefined;
}

/**
 * Delete the entire database (used for full account wipe).
 */
export async function deleteDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
