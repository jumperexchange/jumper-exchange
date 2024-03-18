import { locales } from '@/i18n/i18next-locales';
import { fallbackLng } from '@/i18n/i18next-settings';
import App from './ui/app/App';

interface PageProps {
  params: {
    lng: string;
  };
}

export default async function Page({ params: { lng } }: PageProps) {
  if (locales.indexOf(lng) < 0) {
    lng = fallbackLng;
  }

  return <App starterVariant={'default'} />;
}
