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
  const { initTracking } = useInitUserTracking();
  const { t } = await useServerTranslation(lng);

  return (
    <>
      <WelcomeScreen />
      <Widgets />
      <FeatureCards />
      <Snackbar />
      <SupportModal />
      <PoweredBy fixedPosition={true} />
    </>
  );
}
