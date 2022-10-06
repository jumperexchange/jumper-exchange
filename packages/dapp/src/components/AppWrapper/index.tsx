import { ThemeProvider } from '@emotion/react';
import { CssBaseline, useMediaQuery } from '@mui/material';
import React from 'react';
import App from '../../App';
// import useTheme from '../../hooks/useTheme';
import { darkTheme, lightTheme } from '@transferto/shared/dist';

const AppWrapper = () => {
  // const { isDarkMode } = useTheme();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  // TODO: @Adrian need to import themes from shared package
  // const lightTheme = {};
  // const darkTheme = {};

  return (
    <ThemeProvider theme={prefersDarkMode ? darkTheme : lightTheme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
};

export default AppWrapper;
