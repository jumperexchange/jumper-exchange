/**
 * Recovery Code Adapter
 *
 * The simplest adapter: the share itself IS the recovery code that the user
 * writes down or copies from the UI. No actual persistence is needed --
 * `store()` is a no-op, and `retrieve()` returns null because the user must
 * manually enter the code during the recovery flow.
 */
import type {
  ShareMetadata,
  ShareStorageAdapter,
} from './ShareStorageAdapter.types';

export class RecoveryCodeAdapter implements ShareStorageAdapter {
  static readonly retrieval = 'manual' as const;
  readonly retrieval = RecoveryCodeAdapter.retrieval;
  readonly type = 'recoveryCode' as const;
  readonly label = 'Recovery Code';
  readonly provider = 'manual' as const;

  async store(_share: string, _metadata: ShareMetadata): Promise<boolean> {
    // The share is presented directly in the UI for the user to save.
    // No backend or device storage is involved.
    return true;
  }

  async retrieve(_metadata: ShareMetadata): Promise<string | null> {
    // The user must manually input the recovery code.
    return null;
  }

  async isAvailable(): Promise<boolean> {
    return true;
  }
}
