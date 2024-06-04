import { getCookies } from '@/app/lib/getCookies';
import { FeatureCards } from '@/components/FeatureCards/FeatureCards';
import { Snackbar } from '@/components/Snackbar/Snackbar';
import { WelcomeScreen } from '@/components/WelcomeScreen/WelcomeScreen';
import { Widgets } from '@/components/Widgets/Widgets';
import { PixelBg } from '@/components/illustrations/PixelBg';
import type { StarterVariantType } from '@/types/internal';

export interface AppProps {
  starterVariant: StarterVariantType;
}

const App = ({ starterVariant }: AppProps) => {
  const { activeTheme, welcomeScreenClosed } = getCookies();
  const isWelcomeScreenClosed = welcomeScreenClosed === 'true';

  return (
    <>
      <p>IsMetamask? {navigator?.userAgent?.includes('MetaMaskMobile')}</p>
      <p>IsPhantom? {navigator?.userAgent?.includes('Phantom')}</p>
      <WelcomeScreen closed={isWelcomeScreenClosed} />
      <Widgets
        widgetVariant={starterVariant}
        activeTheme={activeTheme}
        closedWelcomeScreen={isWelcomeScreenClosed}
      />
      <FeatureCards />
      <Snackbar />
      <PixelBg />
    </>
  );
};

export default App;
