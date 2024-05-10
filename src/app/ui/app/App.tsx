import { FeatureCards } from '@/components/FeatureCards/FeatureCards';
import { Snackbar } from '@/components/Snackbar/Snackbar';
import { WelcomeScreen } from '@/components/WelcomeScreen/WelcomeScreen';
import { Widgets } from '@/components/Widgets/Widgets';
import type { StarterVariantType } from '@/types/internal';
import type { ThemeModesSupported } from '@/types/settings';
import { cookies } from 'next/headers';
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
  const cookieStore = cookies();
  const theme = cookieStore.get('theme');

  console.log('theme cookie', theme);

  return (
    <>
      <WelcomeScreen closed={welcomeScreenClosedCookie} />
      <Widgets
        widgetVariant={starterVariant}
        activeTheme={activeTheme}
        closedWelcomeScreen={welcomeScreenClosedCookie}
        appearance={theme.value}
      />
      <FeatureCards />
      <Snackbar />
    </>
  );
};

export default App;
