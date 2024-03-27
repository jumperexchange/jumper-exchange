'use client';
import { BackgroundGradient } from '@/components/BackgroundGradient';
import { FeatureCards } from '@/components/FeatureCards/FeatureCards';
import { Navbar } from '@/components/Navbar/Navbar';
import { PoweredBy } from '@/components/PoweredBy/PoweredBy';
import { Snackbar } from '@/components/Snackbar/Snackbar';
import { SupportModal } from '@/components/SupportModal/SupportModal';
import { WelcomeScreen } from '@/components/WelcomeScreen/WelcomeScreen';
import { Widgets } from '@/components/Widgets/Widgets';
import { Cookie3Provider } from '@/providers/Cookie3Provider';
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { WalletProvider } from '@/providers/WalletProvider';
import type { StarterVariantType } from '@/types/internal';
import { cookie3Analytics } from '@cookie3/analytics';
import { cookie3Config } from 'src/const/cookie3';

interface AppProps {
  starterVariant: StarterVariantType;
}
const analytics = cookie3Analytics(cookie3Config);

const App = ({ starterVariant }: AppProps) => {
  return (
    <ReactQueryProvider>
      <ThemeProvider>
        <WalletProvider>
          <Cookie3Provider value={analytics}>
            <BackgroundGradient />
            <Navbar />
            <WelcomeScreen />
            <Widgets widgetVariant={starterVariant} />
            <FeatureCards />
            <Snackbar />
            <SupportModal />
            <PoweredBy fixedPosition={true} />
          </Cookie3Provider>
        </WalletProvider>
      </ThemeProvider>
    </ReactQueryProvider>
  );
};

export default App;
