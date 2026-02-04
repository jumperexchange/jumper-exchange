import type { ReactNode } from 'react';
import './global.css';
import type { Metadata } from 'next';
import envConfig from '@/config/env-config';
import { getMiniAppSettings } from './lib/getMiniAppSettings';
import { baseMiniApp } from './lib/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const PUBLIC_URL = envConfig.NEXT_PUBLIC_SITE_URL as string;
  const { appId } = await getMiniAppSettings().catch(() => ({ appId: '' }));

  return {
    other: {
      'base:app_id': appId,
      'fc:miniapp': JSON.stringify({
        version: 'next',
        imageUrl: new URL(baseMiniApp.iconUrl, PUBLIC_URL).toString(),
        button: {
          title: `Launch Jumper`,
          action: {
            type: 'launch_miniapp',
            name: 'Jumper',
            url: PUBLIC_URL,
            splashImageUrl: new URL(
              baseMiniApp.splashImageUrl,
              PUBLIC_URL,
            ).toString(),
            splashBackgroundColor: baseMiniApp.splashBackgroundColor,
          },
        },
      }),
    },
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
