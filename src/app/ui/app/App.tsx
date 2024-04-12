import { FeatureCards } from '@/components/FeatureCards/FeatureCards';
import { Snackbar } from '@/components/Snackbar/Snackbar';
import { WelcomeScreen } from '@/components/WelcomeScreen/WelcomeScreen';
import { Widgets } from '@/components/Widgets/Widgets';
import type { StarterVariantType } from '@/types/internal';
import type { ThemeModesSupported } from 'src/types/settings';
interface AppProps {
  starterVariant: StarterVariantType;
  activeTheme: ThemeModesSupported | undefined;
}

const App = ({ starterVariant, activeTheme }: AppProps) => {
  return (
    <>
      <WelcomeScreen />
      <Widgets widgetVariant={starterVariant} activeTheme={activeTheme} />
      <FeatureCards />
      <Snackbar />
    </>
  );
};

export default App;
