import { FeatureCards } from '@/components/FeatureCards/FeatureCards';
import { Snackbar } from '@/components/Snackbar/Snackbar';
import { WelcomeScreen } from '@/components/WelcomeScreen/WelcomeScreen';
import { Widgets } from '@/components/Widgets/Widgets';
import type { StarterVariantType } from '@/types/internal';
import type { ThemeModesSupported } from 'src/types/settings';
export interface AppProps {
  starterVariant: StarterVariantType;
  activeTheme: ThemeModesSupported | undefined;
  welcomeScreenClosedCookie: boolean;
}

const App = ({
  starterVariant,
  activeTheme,
  welcomeScreenClosedCookie,
}: AppProps) => {
  return (
    <>
      <WelcomeScreen closed={welcomeScreenClosedCookie} />
      <Widgets
        widgetVariant={starterVariant}
        activeTheme={activeTheme}
        closedWelcomeScreen={welcomeScreenClosedCookie}
      />
      <FeatureCards />
      <Snackbar />
    </>
  );
};

export default App;
