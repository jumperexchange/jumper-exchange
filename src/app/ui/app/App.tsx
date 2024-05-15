import { FeatureCards } from '@/components/FeatureCards/FeatureCards';
import { Snackbar } from '@/components/Snackbar/Snackbar';
import { WelcomeScreen } from '@/components/WelcomeScreen/WelcomeScreen';
import { Widgets } from '@/components/Widgets/Widgets';
import type { StarterVariantType } from '@/types/internal';
import type { ThemeModesSupported } from '@/types/settings';
import { getCookies } from '@/app/lib/getCookies';
export interface AppProps {
  starterVariant: StarterVariantType;
  // activeTheme: ThemeModesSupported | undefined;
  // welcomeScreenClosedCookie: boolean;
}

const App = ({
  starterVariant,
  // activeTheme,
  // welcomeScreenClosedCookie,
}: AppProps) => {
  const { activeTheme, welcomeScreenClosed } = getCookies();
  const isWelcomeScreenClosed = welcomeScreenClosed === 'true';

  return (
    <>
      <WelcomeScreen closed={isWelcomeScreenClosed} />
      <Widgets
        widgetVariant={starterVariant}
        activeTheme={activeTheme}
        closedWelcomeScreen={isWelcomeScreenClosed}
      />
      <FeatureCards />
      <Snackbar />
    </>
  );
};

export default App;
