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
    // A 404 simply means there is no legacy contact to migrate. Any other
    // Intercom failure (expired/invalid token, rate limit, outage) must not
    // bubble up: migration is best-effort, and a lookup failure should never
    // break minting a fresh anonymous session for the caller.
    if (!(error instanceof IntercomError && error.statusCode === 404)) {
      console.error('Intercom contact lookup failed:', error);
    }

    return null;
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
