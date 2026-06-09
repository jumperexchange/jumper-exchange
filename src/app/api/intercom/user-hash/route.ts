import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import envConfig from 'src/config/env-config';
import { isValidAddress } from 'src/utils/regex-patterns';
import {
  INTERCOM_USER_ID_V2_COOKIE,
  INTERCOM_USER_ID_V2_COOKIE_MAX_AGE,
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

  return jwt.sign(payload, secret, { expiresIn: '1h' });
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
      maxAge: INTERCOM_USER_ID_V2_COOKIE_MAX_AGE,
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

  if (contact) {
    await updateContactWalletAddress(contact.id, walletAddress, accessToken);
  }
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
        await syncWalletAddressToContact(
          userIdV2FromCookie,
          validatedWallet,
          intercomAccessToken,
        );
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
