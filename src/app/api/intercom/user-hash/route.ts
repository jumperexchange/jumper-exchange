import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import envConfig from 'src/config/env-config';
import { isValidAddress } from 'src/utils/regex-patterns';
import {
  INTERCOM_SESSION_MAX_AGE_SECONDS,
  INTERCOM_USER_ID_V2_COOKIE,
} from './constants';
import {
  findContactByExternalId,
  migrateContactToV2UserId,
  updateContactWalletAddress,
} from './intercom-contact';

type RequestBody = {
  wallet_address?: string;
};

const generateV2UserId = (): string => crypto.randomUUID();

const signIntercomUserToken = (
  userId: string,
  secret: string,
  walletAddress?: string,
): string => {
  const payload: Record<string, string> = { user_id: userId };

  if (walletAddress) {
    payload.wallet_address = walletAddress;
  }

  return jwt.sign(payload, secret, {
    expiresIn: INTERCOM_SESSION_MAX_AGE_SECONDS,
  });
};

const buildJsonResponse = (
  userId: string,
  userHash: string,
  options?: { setUserIdCookie?: boolean },
): NextResponse => {
  const response = NextResponse.json({ user_id: userId, user_hash: userHash });

  if (options?.setUserIdCookie) {
    response.cookies.set(INTERCOM_USER_ID_V2_COOKIE, userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: INTERCOM_SESSION_MAX_AGE_SECONDS,
    });
  }

  return response;
};

const syncWalletAddressToContact = async (
  userId: string,
  walletAddress: string,
  accessToken: string,
): Promise<void> => {
  const contact = await findContactByExternalId(userId, accessToken);

  if (!contact) {
    return;
  }

  const updated = await updateContactWalletAddress(
    contact.id,
    walletAddress,
    accessToken,
  );

  if (!updated) {
    throw new Error(
      `Intercom wallet_address update failed for contact ${contact.id}`,
    );
  }
};

const syncWalletAddressToContactWithRetry = async (
  userId: string,
  walletAddress: string,
  accessToken: string,
): Promise<void> => {
  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      await syncWalletAddressToContact(userId, walletAddress, accessToken);
      return;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
};

export const POST = async (request: NextRequest) => {
  try {
    const body = (await request.json()) as RequestBody;
    const { wallet_address: walletAddress } = body;

    const secret = envConfig.INTERCOM_SECRET_KEY;
    if (!secret) {
      return NextResponse.json(
        { error: 'Authentication service unavailable' },
        { status: 500 },
      );
    }

    const validatedWallet =
      walletAddress && isValidAddress(walletAddress)
        ? walletAddress
        : undefined;

    const intercomAccessToken = envConfig.INTERCOM_API_TOKEN;
    const userIdV2FromCookie = request.cookies.get(
      INTERCOM_USER_ID_V2_COOKIE,
    )?.value;

    if (userIdV2FromCookie) {
      if (intercomAccessToken && validatedWallet) {
        try {
          await syncWalletAddressToContactWithRetry(
            userIdV2FromCookie,
            validatedWallet,
            intercomAccessToken,
          );
        } catch (error) {
          console.error('Intercom wallet_address sync failed after retry', {
            userId: userIdV2FromCookie,
            walletAddress: validatedWallet,
            error,
          });
        }
      }

      const userHash = signIntercomUserToken(
        userIdV2FromCookie,
        secret,
        validatedWallet,
      );
      return buildJsonResponse(userIdV2FromCookie, userHash);
    }

    if (!validatedWallet) {
      return NextResponse.json(
        { error: 'wallet_address is required when no intercom user id exists' },
        { status: 400 },
      );
    }

    let userIdV2 = generateV2UserId();

    if (intercomAccessToken) {
      const existingV1Contact = await findContactByExternalId(
        validatedWallet,
        intercomAccessToken,
      );

      if (existingV1Contact) {
        const migratedUserIdV2 = generateV2UserId();
        const migrated = await migrateContactToV2UserId(
          existingV1Contact.id,
          migratedUserIdV2,
          validatedWallet,
          intercomAccessToken,
        );

        if (migrated) {
          userIdV2 = migratedUserIdV2;
        }
      }
    }

    const userHash = signIntercomUserToken(userIdV2, secret, validatedWallet);
    return buildJsonResponse(userIdV2, userHash, { setUserIdCookie: true });
  } catch (error) {
    console.error('Error generating Intercom user hash:', error);
    return NextResponse.json(
      { error: 'Failed to generate user hash' },
      { status: 500 },
    );
  }
};
