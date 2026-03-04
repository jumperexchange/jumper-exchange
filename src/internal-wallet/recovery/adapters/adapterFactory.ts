import type { ShareStorageType } from '../../crypto/types';
import type {
  AdapterFields,
  ShareStorageAdapter,
} from './ShareStorageAdapter.types';
import { LocalStorageAdapter } from './localStorageAdapter';
import { EmailShareAdapter } from './emailShareAdapter';
import { GoogleDriveShareAdapter } from './googleDriveShareAdapter';
import { RecoveryCodeAdapter } from './recoveryCodeAdapter';
import { InstagramShareAdapter } from './instagramShareAdapter';
import { TelegramShareAdapter } from './telegramShareAdapter';
import { WhatsAppShareAdapter } from './whatsappShareAdapter';

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
    case 'instagram':
      return new InstagramShareAdapter(adapterFields.instagram ?? '');
    case 'telegram':
      return new TelegramShareAdapter(adapterFields.telegram ?? '');
    case 'whatsapp':
      return new WhatsAppShareAdapter(adapterFields.whatsapp ?? '');
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
    case 'instagram':
      return InstagramShareAdapter.retrieval;
    case 'telegram':
      return TelegramShareAdapter.retrieval;
    case 'whatsapp':
      return WhatsAppShareAdapter.retrieval;
    default: {
      const _: never = type;
      throw new Error(`Unhandled adapter type: ${_}`);
    }
  }
}
