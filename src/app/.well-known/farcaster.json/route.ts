import { getMiniAppSettings } from '@/app/lib/getMiniAppSettings';
import {
  iconUrl,
  miniAppUrl,
  splashBackgroundColor,
  splashImageUrl,
} from '@/utils/miniApp';

export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL as string;

  const {
    data: { accountAssociation },
  } = await getMiniAppSettings();

  return Response.json({
    ...accountAssociation,
    miniapp: {
      version: '1',
      name: 'Jumper Mini App',
      homeUrl: miniAppUrl,
      iconUrl: iconUrl,
      splashImageUrl: splashImageUrl,
      splashBackgroundColor: splashBackgroundColor,
      webhookUrl: '',
      subtitle: 'Find the best route',
      description: 'A fast way to get any token you want',
      screenshotUrls: [
        'https://ex.co/s1.png',
        'https://ex.co/s2.png',
        'https://ex.co/s3.png',
      ],
      primaryCategory: 'social',
      tags: ['example', 'miniapp', 'baseapp'],
      heroImageUrl: 'https://ex.co/og.png',
      tagline: 'Play instantly',
      ogTitle: 'Jumper Mini App',
      ogDescription: 'Find the best route.',
      ogImageUrl: 'https://ex.co/og.png',
      noindex: true,
    },
  }); // see the next step for the manifest_json_object
}
