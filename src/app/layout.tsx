import type { ReactNode } from 'react';
import './global.css';
import type { Metadata } from 'next';
import {
  iconUrl,
  splashBackgroundColor,
  splashImageUrl,
} from '@/utils/miniApp';
import { getMiniAppSettings } from './lib/getMiniAppSettings';

export async function generateMetadata(): Promise<Metadata> {
  const PUBLIC_URL = process.env.NEXT_PUBLIC_SITE_URL as string;
  const { appId } = await getMiniAppSettings().catch(() => ({ appId: '' }));

  return {
    other: {
      'base:app_id': appId,
      'fc:miniapp': JSON.stringify({
        version: 'next',
        imageUrl: new URL(iconUrl, PUBLIC_URL).toString(),
        button: {
          title: `Launch Jumper`,
          action: {
            type: 'launch_miniapp',
            name: 'Jumper',
            url: PUBLIC_URL,
            splashImageUrl: new URL(splashImageUrl, PUBLIC_URL).toString(),
            splashBackgroundColor: splashBackgroundColor,
          },
        },
      }),
    },
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
