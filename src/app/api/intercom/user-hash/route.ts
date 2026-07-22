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
} from './intercom-contact';

type RequestBody = {
  wallet_address?: string;
};

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const generateV2UserId = (): string => crypto.randomUUID();

/**
 * The v2 user id is a server-minted UUID. Only trust a cookie value that still
 * looks like one — an attacker-chosen or corrupted cookie must not be signed
 * into a valid Intercom identity; we mint a fresh session instead.
 */
const isValidV2UserId = (value: string): boolean => UUID_REGEX.test(value);

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

    const trimmedWallet = walletAddress?.trim();
    const validatedWallet =
      trimmedWallet && isValidAddress(trimmedWallet)
        ? trimmedWallet
        : undefined;

    const intercomAccessToken = envConfig.INTERCOM_API_TOKEN;
    const userIdV2FromCookie = request.cookies.get(
      INTERCOM_USER_ID_V2_COOKIE,
    )?.value;

    if (userIdV2FromCookie && isValidV2UserId(userIdV2FromCookie)) {
      const userHash = signIntercomUserToken(
        userIdV2FromCookie,
        secret,
        validatedWallet,
      );
      return buildJsonResponse(userIdV2FromCookie, userHash);
    }

    const userIdV2 = generateV2UserId();

    if (intercomAccessToken && validatedWallet) {
      const existingV1Contact = await findContactByExternalId(
        validatedWallet,
        intercomAccessToken,
      );

      if (existingV1Contact) {
        await migrateContactToV2UserId(
          existingV1Contact.id,
          userIdV2,
          validatedWallet,
          intercomAccessToken,
        );
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
