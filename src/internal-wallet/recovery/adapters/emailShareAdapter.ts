/**
 * Email Share Adapter
 *
 * Sends a Shamir recovery share to the user's email via a backend API.
 * Retrieval always returns null because the user must manually paste the
 * share from their email during the recovery flow.
 */
import type {
  ShareMetadata,
  ShareStorageAdapter,
} from './ShareStorageAdapter.types';

export class EmailShareAdapter implements ShareStorageAdapter {
  static readonly retrieval = 'manual';
  readonly retrieval = EmailShareAdapter.retrieval;
  readonly type = 'email' as const;
  readonly label = 'Email';
  readonly provider = 'email';

  constructor(private readonly email: string) {}

  async store(share: string, metadata: ShareMetadata): Promise<boolean> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/jumper-wallet/send-recovery-share`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: this.email,
            share,
            walletAddress: metadata.walletAddress,
          }),
        },
      );

      if (!response.ok) {
        const errorBody = await response.text().catch(() => 'Unknown error');
        throw new Error(
          `Failed to send recovery share email (${response.status}): ${errorBody}`,
        );
      }

      return true;
    } catch (error) {
      console.error('[EmailShareAdapter] store failed:', error);
      return false;
    }
  }

  async retrieve(_metadata: ShareMetadata): Promise<string | null> {
    // The user must manually input the share from their email.
    return null;
  }

  async isAvailable(): Promise<boolean> {
    // Email delivery is always reachable; the address itself is validated
    // at distribution time, not here.
    return true;
  }
}
