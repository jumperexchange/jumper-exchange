'use server';
import { locales } from '@/i18n/i18next-locales';
import { fallbackLng } from '@/i18n/i18next-settings';
import dynamic from 'next/dynamic';

interface PageProps {
  params: {
    lng: string;
  };
}

const App = dynamic(() => import('./ui/app/App'), { ssr: false });

export default async function Page({ params: { lng } }: PageProps) {
  if (locales.indexOf(lng) < 0) {
    lng = fallbackLng;
  }

  return <App starterVariant="default" />;
}
