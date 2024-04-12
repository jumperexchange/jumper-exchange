import { FeatureCards } from '@/components/FeatureCards/FeatureCards';
import { Snackbar } from '@/components/Snackbar/Snackbar';
import { WelcomeScreen } from '@/components/WelcomeScreen/WelcomeScreen';
import { Widgets } from '@/components/Widgets/Widgets';
import type { StarterVariantType } from '@/types/internal';
import { cookies } from 'next/headers';
import type { ThemeModesSupported } from 'src/types/settings';
interface AppProps {
  starterVariant: StarterVariantType;
  activeTheme: ThemeModesSupported | undefined;
}

const App = ({ starterVariant, activeTheme }: AppProps) => {
  const welcomeScreenClosed = cookies().get('welcomeScreenClosed')?.value as
    | 'false'
    | 'true'
    | undefined;

  return (
    <>
      <WelcomeScreen closed={welcomeScreenClosed === 'true' ? true : false} />
      <Widgets
        widgetVariant={starterVariant}
        activeTheme={activeTheme}
        closedWelcomeScreen={welcomeScreenClosed === 'true' ? true : false}
      />
      <FeatureCards />
      <Snackbar />
    </>
  );
};

export default App;
