import { UserTracking } from './UserTracking';
import {
  FeatureCards,
  Navbar,
  PoweredBy,
  Snackbar,
  SupportModal,
  WelcomeScreen,
  Widgets,
} from './components';
import { AppProvider } from './providers';

export function App() {
  return (
    <AppProvider>
      <UserTracking />
      <Navbar />
      <WelcomeScreen />
      <Widgets />
      <FeatureCards />
      <PoweredBy />
      <Snackbar />
      <SupportModal />
    </AppProvider>
  );
}
