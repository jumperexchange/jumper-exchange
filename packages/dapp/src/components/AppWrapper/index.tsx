import { ThemeProvider } from '@emotion/react';
import { CssBaseline, useMediaQuery } from '@mui/material';
import { darkTheme, lightTheme } from '@transferto/shared';
import App from '../../App';
import { WalletProvider } from '../../providers/WalletProvider';

const AppWrapper = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  return (
    <ThemeProvider theme={!!prefersDarkMode ? darkTheme : lightTheme}>
      <WalletProvider>
        <CssBaseline />
        <App />
      </WalletProvider>
    </ThemeProvider>
  );
};

export default AppWrapper;
