/**
 * Instagram Share Adapter (Dummy)
 *
 * Placeholder adapter that would send a Shamir recovery share via Instagram
 * Direct Message. Not integrated — store() is a no-op and always returns false.
 * Enable in Advanced Setup to include this slot in your recovery configuration.
 */
import type {
  ShareMetadata,
  MessagingShareAdapter,
} from './ShareStorageAdapter.types';

export class InstagramShareAdapter implements MessagingShareAdapter {
  static readonly retrieval = 'manual' as const;
  readonly retrieval = InstagramShareAdapter.retrieval;
  readonly type = 'instagram' as const;
  readonly label = 'Instagram';
  readonly provider = 'meta' as const;
  readonly recipientFieldType = 'username' as const;

  constructor(private readonly username: string) {}

  async store(_share: string, _metadata: ShareMetadata): Promise<boolean> {
    console.warn(
      '[InstagramShareAdapter] store() is not implemented — this is a dummy adapter.',
    );
    return false;
  }

  async retrieve(_metadata: ShareMetadata): Promise<string | null> {
    return null;
  }

  async isAvailable(): Promise<boolean> {
    return !!this.username;
  }

  async connect(): Promise<boolean> {
    return true;
  }

  async isValid(_metadata: ShareMetadata): Promise<boolean> {
    return !!this.username;
  }
}
