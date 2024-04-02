import { locales } from '@/i18n/i18next-locales';
import { fallbackLng } from '@/i18n/i18next-settings';
import dynamic from 'next/dynamic';

import type { Viewport } from 'next';
import { generateMetadata } from '../lib/generateMetadata';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

const App = dynamic(() => import('../ui/app/App'), { ssr: false });

export default async function Page({
  params: { lng },
}: {
  params: {
    lng: string;
  };
}) {
  if (locales.indexOf(lng) < 0) {
    lng = fallbackLng;
  }

  generateMetadata();

  return <App starterVariant="default" />;
}
