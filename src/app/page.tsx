import { FeatureCards } from '@/components/FeatureCards';
import { PoweredBy } from '@/components/PoweredBy/PoweredBy';
import { Snackbar } from '@/components/Snackbar/Snackbar';
import { SupportModal } from '@/components/SupportModal/SupportModal';
import { WelcomeScreen } from '@/components/WelcomeScreen/WelcomeScreen';
import { Widgets } from '@/components/Widgets';
import { useInitUserTracking } from '@/hooks/userTracking/useInitUserTracking';
import { locales } from '@/i18n/i18next-locales';
import { fallbackLng } from '@/i18n/i18next-settings';
import { useServerTranslation } from '@/i18n/useServerTranslation';
import type { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: product.title,
  };
}

interface PageProps {
  params: {
    lng: string;
  };
}

export default async function Page({ params: { lng } }: PageProps) {
  if (locales.indexOf(lng) < 0) {
    lng = fallbackLng;
  }
  const { initTracking } = useInitUserTracking();
  const { t } = await useServerTranslation(lng);

  return (
    <>
      <WelcomeScreen />
      <Widgets widgetVariant="default" />
      <FeatureCards />
      <Snackbar />
      <SupportModal />
      <PoweredBy fixedPosition={true} />
    </>
  );
}
