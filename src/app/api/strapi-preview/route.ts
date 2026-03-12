import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import envConfig from '@/config/env-config';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const url = searchParams.get('url');
  const status = searchParams.get('status');

  if (secret !== envConfig.STRAPI_PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 });
  }

  const draftModeHeader = await draftMode();
  // Enable Draft Mode by toggling nextjs header
  if (status === 'published') {
    draftModeHeader.disable();
  } else {
    draftModeHeader.enable();
  }

  redirect(url || '/');
}
