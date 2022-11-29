import { CssBaseline } from '@mui/material';
import { defaultSettings } from '@transferto/shared/src/config';
import { SettingsProvider } from '@transferto/shared/src/contexts/SettingsContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from '../../App';
import { I18NProvider } from '../../providers/I18nProvider';
import { ThemeProvider } from '../../providers/ThemeProvider';
import { WalletProvider } from '../../providers/WalletProvider';

const queryClient = new QueryClient();

const AppWrapper = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <I18NProvider>
        <SettingsProvider defaultSettings={defaultSettings}>
          <ThemeProvider>
            <WalletProvider>
              {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
              <CssBaseline />
              <App />
            </WalletProvider>
          </ThemeProvider>
        </SettingsProvider>
      </I18NProvider>
    </QueryClientProvider>
  );
};

export default AppWrapper;
