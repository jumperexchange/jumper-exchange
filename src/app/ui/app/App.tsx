import { FeatureCards } from '@/components/FeatureCards/FeatureCards';
import { Snackbar } from '@/components/Snackbar/Snackbar';
import { WelcomeScreen } from '@/components/WelcomeScreen/WelcomeScreen';
import { Widgets } from '@/components/Widgets/Widgets';
import type { StarterVariantType } from '@/types/internal';
interface AppProps {
  starterVariant: StarterVariantType;
}

const App = ({ starterVariant }: AppProps) => {
  return (
    <>
      <WelcomeScreen />
      <Widgets widgetVariant={starterVariant} />
      <FeatureCards />
      <Snackbar />
    </>
  );
};

export default App;
