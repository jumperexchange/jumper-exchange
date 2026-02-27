import type { ShareRetrievalType, ShareStorageType } from '../../crypto/types';

export interface ShareMetadata {
  walletAddress: string;
  createdAt: number;
}

export interface RetrieveShareParams extends Omit<ShareMetadata, 'createdAt'> {}

export interface ShareStorageAdapter {
  readonly type: ShareStorageType;
  readonly label: string;
  /** Whether this adapter auto-retrieves on mount or requires the user to paste the share. */
  readonly retrieval: ShareRetrievalType;
  store(share: string, metadata: ShareMetadata): Promise<boolean>;
  retrieve(metadata: RetrieveShareParams): Promise<string | null>;
  isAvailable(): Promise<boolean>;
}

// ---------------------------------------------------------------------------
// Adapter field configuration
// ---------------------------------------------------------------------------

/** Metadata describing a single user-provided field for an adapter. */
export interface AdapterFieldConfig {
  inputType: 'email' | 'text' | 'password';
  placeholder: string;
}

/**
 * Registry of adapters that require a user-provided runtime field.
 * Adding an entry here is the only change needed when a new adapter needs
 * a field — TypeScript will surface compile errors at every consumption site.
 */
export const ADAPTER_FIELD_CONFIGS = {
  email: { inputType: 'email', placeholder: 'your@email.com' },
} as const satisfies Partial<Record<ShareStorageType, AdapterFieldConfig>>;

/** The subset of ShareStorageType values that have a required field. Currently: 'email'. */
export type AdaptersWithFields = keyof typeof ADAPTER_FIELD_CONFIGS;

/** Collected field values for all field-bearing adapters. */
export type AdapterFields = { [K in AdaptersWithFields]: string };

/**
 * Type predicate: true when `type` requires a user-provided field.
 * Narrows ShareStorageType → AdaptersWithFields without `as`.
 */
export function adapterHasField(
  type: ShareStorageType,
): type is AdaptersWithFields {
  return Object.prototype.hasOwnProperty.call(ADAPTER_FIELD_CONFIGS, type);
}
