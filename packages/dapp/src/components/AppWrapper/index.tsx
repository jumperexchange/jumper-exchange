import { ThemeProvider } from '@emotion/react';
import { CssBaseline, useMediaQuery } from '@mui/material';
import App from '../../App';
// import useTheme from '../../hooks/useTheme';
import { darkTheme, lightTheme } from '@transferto/shared';
import { WalletProvider } from '../../providers/WalletProvider';

const AppWrapper = () => {
  // const { isDarkMode } = useTheme();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  return (
    <ThemeProvider theme={prefersDarkMode ? darkTheme : lightTheme}>
      <WalletProvider>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <App />
      </WalletProvider>
    </ThemeProvider>
  );
};

export default AppWrapper;
