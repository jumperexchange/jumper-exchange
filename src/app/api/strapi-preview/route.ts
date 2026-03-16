import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import envConfig from '@/config/env-config';
import crypto from 'crypto';

function isValidSecret(secret: string | null) {
  const key = Buffer.from('preview-secret-check');
  const hmacReceived = crypto
    .createHmac('sha256', key)
    .update(secret ?? '')
    .digest();
  const hmacExpected = crypto
    .createHmac('sha256', key)
    .update(envConfig.STRAPI_PREVIEW_SECRET ?? '')
    .digest();
  return crypto.timingSafeEqual(hmacReceived, hmacExpected);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const url = searchParams.get('url');
  const status = searchParams.get('status');

  try {
    if (!isValidSecret(secret)) {
      throw new Error('Invalid token');
    }
    const draftModeHeader = await draftMode();
    // Enable Draft Mode by toggling nextjs header
    if (status === 'published') {
      draftModeHeader.disable();
    } else {
      draftModeHeader.enable();
    }

    redirect(url || '/');
  } catch (err) {
    if (err instanceof Error && err.message === 'Invalid token') {
      if (!secret || !envConfig.STRAPI_PREVIEW_SECRET) {
        console.warn('[preview] auth rejected — missing token', {
          hasClientSecret: !!secret,
          hasEnvSecret: !!envConfig.STRAPI_PREVIEW_SECRET,
          timestamp: new Date().toISOString(),
        });
      }
      return new Response('Invalid token', { status: 401 });
    }
    throw err;
  }
}
