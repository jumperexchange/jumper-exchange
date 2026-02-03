import type { ReactNode } from 'react';
import './global.css';
import type { Metadata } from 'next';
import {
  iconUrl,
  miniAppUrl,
  splashBackgroundColor,
  splashImageUrl,
} from '@/utils/miniApp';
import { getMiniAppSettings } from './lib/getMiniAppSettings';

export async function generateMetadata(): Promise<Metadata> {
  const {
    data: { appId },
  } = await getMiniAppSettings();

  return {
    other: {
      'base:app_id': appId,
      'fc:miniapp': JSON.stringify({
        version: 'next',
        imageUrl: iconUrl,
        button: {
          title: `Launch Jumper`,
          action: {
            type: 'launch_miniapp',
            name: 'Jumper',
            url: miniAppUrl,
            splashImageUrl: splashImageUrl,
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
