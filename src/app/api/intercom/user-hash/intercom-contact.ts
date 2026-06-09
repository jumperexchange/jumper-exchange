import { IntercomError } from 'intercom-client';
import { createIntercomClient } from './intercom-server-client';

export async function findContactByExternalId(
  externalId: string,
  accessToken: string,
): Promise<{ id: string } | null> {
  const client = createIntercomClient(accessToken);

  try {
    const contact = await client.contacts.showContactByExternalId({
      external_id: externalId,
    });

    return { id: contact.id };
  } catch (error) {
    if (error instanceof IntercomError && error.statusCode === 404) {
      return null;
    }

    throw error;
  }
}

export async function updateContactWalletAddress(
  contactId: string,
  walletAddress: string,
  accessToken: string,
): Promise<boolean> {
  const client = createIntercomClient(accessToken);

  try {
    await client.contacts.update({
      contact_id: contactId,
      custom_attributes: {
        wallet_address: walletAddress,
      },
    });

    return true;
  } catch (error) {
    console.error('Intercom wallet_address update failed:', error);
    return false;
  }
}

export async function migrateContactToV2UserId(
  contactId: string,
  newUserId: string,
  walletAddress: string,
  accessToken: string,
): Promise<boolean> {
  const client = createIntercomClient(accessToken);

  try {
    await client.contacts.update({
      contact_id: contactId,
      external_id: newUserId,
      custom_attributes: {
        wallet_address: walletAddress,
      },
    });

    return true;
  } catch (error) {
    console.error('Intercom contact migration failed:', error);
    return false;
  }
}
