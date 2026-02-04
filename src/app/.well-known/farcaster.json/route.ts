import { getMiniAppSettings } from '@/app/lib/getMiniAppSettings';
import { baseMiniApp } from '@/app/lib/metadata';

export async function GET() {
  const PUBLIC_URL = process.env.NEXT_PUBLIC_SITE_URL as string;

  const { accountAssociation } = await getMiniAppSettings().catch(() => ({
    accountAssociation: {},
  }));

  return Response.json({
    ...accountAssociation,
    miniapp: {
      version: '1',
      name: baseMiniApp.miniAppName,
      homeUrl: PUBLIC_URL,
      iconUrl: new URL(baseMiniApp.iconUrl, PUBLIC_URL).toString(),
      splashImageUrl: new URL(
        baseMiniApp.splashImageUrl,
        PUBLIC_URL,
      ).toString(),
      splashBackgroundColor: baseMiniApp.splashBackgroundColor,
      webhookUrl: '',
      subtitle: 'Find the best route',
      description: 'A fast way to get any token you want',
      screenshotUrls: [],
      primaryCategory: 'finance',
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
