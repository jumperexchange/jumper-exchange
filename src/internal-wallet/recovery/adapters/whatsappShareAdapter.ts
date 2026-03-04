/**
 * WhatsApp Share Adapter (Dummy)
 *
 * Placeholder adapter that would send a Shamir recovery share via WhatsApp
 * message. Not integrated — store() is a no-op and always returns false.
 * Enable in Advanced Setup to include this slot in your recovery configuration.
 */
import type {
  ShareMetadata,
  MessagingShareAdapter,
} from './ShareStorageAdapter.types';

export class WhatsAppShareAdapter implements MessagingShareAdapter {
  static readonly retrieval = 'manual' as const;
  readonly retrieval = WhatsAppShareAdapter.retrieval;
  readonly type = 'whatsapp' as const;
  readonly label = 'WhatsApp';
  readonly provider = 'meta' as const;
  readonly recipientFieldType = 'phone' as const;

  constructor(private readonly phoneNumber: string) {}

  async store(_share: string, _metadata: ShareMetadata): Promise<boolean> {
    console.warn(
      '[WhatsAppShareAdapter] store() is not implemented — this is a dummy adapter.',
    );
    return false;
  }

  async retrieve(_metadata: ShareMetadata): Promise<string | null> {
    return null;
  }

  async isAvailable(): Promise<boolean> {
    return !!this.phoneNumber;
  }

  async connect(): Promise<boolean> {
    return true;
  }

  async isValid(_metadata: ShareMetadata): Promise<boolean> {
    return !!this.phoneNumber;
  }
}
