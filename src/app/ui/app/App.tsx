'use client';
import { FeatureCards } from '@/components/FeatureCards/FeatureCards';
import { Snackbar } from '@/components/Snackbar/Snackbar';
import { SupportModal } from '@/components/SupportModal/SupportModal';
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
      <SupportModal />
    </>
  );
};

export default App;
