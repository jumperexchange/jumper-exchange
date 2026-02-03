import { getMiniAppSettings } from '@/app/lib/getMiniAppSettings';
import {
  iconUrl,
  splashBackgroundColor,
  splashImageUrl,
} from '@/utils/miniApp';

export async function GET() {
  const PUBLIC_URL = process.env.NEXT_PUBLIC_SITE_URL as string;

  const {
    data: { accountAssociation },
  } = await getMiniAppSettings();

  return Response.json({
    ...accountAssociation,
    miniapp: {
      version: '1',
      name: 'Jumper Mini App',
      homeUrl: PUBLIC_URL,
      iconUrl: new URL(iconUrl, PUBLIC_URL).toString(),
      splashImageUrl: new URL(splashImageUrl, PUBLIC_URL).toString(),
      splashBackgroundColor: splashBackgroundColor,
      webhookUrl: '',
      subtitle: 'Find the best route',
      description: 'A fast way to get any token you want',
      screenshotUrls: [],
      primaryCategory: 'swap',
      tags: ['jumper', 'finance', 'swap', 'defi'],
      heroImageUrl: 'https://ex.co/og.png',
      tagline: 'Play instantly',
      ogTitle: 'Jumper Mini App',
      ogDescription: 'Find the best route.',
      ogImageUrl: 'https://ex.co/og.png',
      noindex: true,
    },
  }); // see the next step for the manifest_json_object
}
