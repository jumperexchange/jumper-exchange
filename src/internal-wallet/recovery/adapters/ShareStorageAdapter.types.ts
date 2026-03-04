import type {
  ShareRetrievalType,
  ShareStorageProvider,
  ShareStorageType,
} from '../../crypto/types';

export interface ShareMetadata {
  walletAddress: string;
  createdAt: number;
}

export interface RetrieveShareParams extends Omit<ShareMetadata, 'createdAt'> {}

export interface ShareStorageAdapter {
  readonly type: ShareStorageType;
  readonly label: string;
  /** Identifies the service/company that owns this storage (e.g. 'google', 'device'). Reserved for future redundancy warnings. */
  readonly provider: ShareStorageProvider;
  /** Whether this adapter auto-retrieves on mount or requires the user to paste the share. */
  readonly retrieval: ShareRetrievalType;
  store(share: string, metadata: ShareMetadata): Promise<boolean>;
  retrieve(metadata: RetrieveShareParams): Promise<string | null>;
  /** Passive check — no side-effects. Returns true if the adapter is already ready. */
  isAvailable(): Promise<boolean>;
  /** User-initiated connection. May trigger OAuth or other interactive flows. */
  connect(): Promise<boolean>;
  /** Pre-store gate — returns true if store(share, metadata) is expected to succeed. */
  isValid(metadata: ShareMetadata): Promise<boolean>;
}

/**
 * Sub-interface for messaging-channel adapters (Instagram, Telegram, WhatsApp).
 * These are opt-in adapters that send the recovery share via a messaging app.
 * Implementations are dummy until real integrations are built.
 */
export interface MessagingShareAdapter extends ShareStorageAdapter {
  /** The kind of recipient identifier the user must provide. */
  readonly recipientFieldType: 'phone' | 'username';
}

// ---------------------------------------------------------------------------
// Adapter field configuration
// ---------------------------------------------------------------------------

/** Metadata describing a single user-provided field for an adapter. */
export interface AdapterFieldConfig {
  inputType: 'email' | 'text' | 'password' | 'tel';
  autoComplete: string;
  placeholder: string;
}

/**
 * Registry of adapters that require a user-provided runtime field.
 * Adding an entry here is the only change needed when a new adapter needs
 * a field — TypeScript will surface compile errors at every consumption site.
 */
export const ADAPTER_FIELD_CONFIGS = {
  email: {
    inputType: 'email',
    autoComplete: 'email',
    placeholder: 'your@email.com',
  },
  instagram: {
    inputType: 'text',
    autoComplete: 'off',
    placeholder: '@username',
  },
  telegram: {
    inputType: 'text',
    autoComplete: 'off',
    placeholder: '@username or +1234567890',
  },
  whatsapp: {
    inputType: 'tel',
    autoComplete: 'tel',
    placeholder: '+1234567890',
  },
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
