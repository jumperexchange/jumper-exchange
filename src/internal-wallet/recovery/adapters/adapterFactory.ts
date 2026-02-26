import type { ShareStorageType } from '../../crypto/types';
import type {
  AdapterFields,
  ShareStorageAdapter,
} from './ShareStorageAdapter.types';
import { LocalStorageAdapter } from './localStorageAdapter';
import { EmailShareAdapter } from './emailShareAdapter';
import { GoogleDriveShareAdapter } from './googleDriveShareAdapter';
import { RecoveryCodeAdapter } from './recoveryCodeAdapter';

export function createAdapter(
  type: ShareStorageType,
  adapterFields: Partial<AdapterFields>,
): ShareStorageAdapter {
  switch (type) {
    case 'localStorage':
      return new LocalStorageAdapter();
    case 'email':
      return new EmailShareAdapter(adapterFields.email ?? '');
    case 'googleDrive':
      return new GoogleDriveShareAdapter();
    case 'recoveryCode':
      return new RecoveryCodeAdapter();
    default: {
      const _: never = type;
      throw new Error(`Unhandled adapter type: ${_}`);
    }
  }
}

export function getAdapterRetrieval(type: ShareStorageType): 'auto' | 'manual' {
  switch (type) {
    case 'localStorage':
      return LocalStorageAdapter.retrieval;
    case 'googleDrive':
      return GoogleDriveShareAdapter.retrieval;
    case 'email':
      return EmailShareAdapter.retrieval;
    case 'recoveryCode':
      return RecoveryCodeAdapter.retrieval;
    default: {
      const _: never = type;
      throw new Error(`Unhandled adapter type: ${_}`);
    }
  }
}
