import { CssBaseline } from '@mui/material';
import { defaultSettings, SettingsProvider } from '@transferto/shared/src';
import ReactGA from 'react-ga';
import { hotjar } from 'react-hotjar';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from '../../App';
import { ChainInfosProvider } from '../../providers/ChainInfosProvider';
import { I18NProvider } from '../../providers/I18nProvider';
import { MenuProvider } from '../../providers/MenuProvider';
import { ThemeProvider } from '../../providers/ThemeProvider';
import { WalletProvider } from '../../providers/WalletProvider';
import { HistoryMigration } from '../HistoryMigration';

const queryClient = new QueryClient();

const AppWrapper = () => {
  ReactGA.initialize(
    (import.meta as any).env.VITE_GOOGLE_ANALYTICS_TRACKING_ID,
  );
  hotjar.initialize(
    (import.meta as any).env.VITE_HOTJAR_ID,
    (import.meta as any).env.VITE_HOTJAR_SNIPPET_VERSION,
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ChainInfosProvider>
        <I18NProvider>
          <SettingsProvider defaultSettings={defaultSettings}>
            <MenuProvider>
              <ThemeProvider>
                <WalletProvider>
                  {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                  <CssBaseline />
                  <App />
                </WalletProvider>
              </ThemeProvider>
            </MenuProvider>
          </SettingsProvider>
        </I18NProvider>
      </ChainInfosProvider>
      <HistoryMigration />
    </QueryClientProvider>
  );
};

export default AppWrapper;
