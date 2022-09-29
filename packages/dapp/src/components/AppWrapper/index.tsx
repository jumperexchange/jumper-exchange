import { ThemeProvider } from '@emotion/react';
import { CssBaseline, styled } from '@mui/material';
import React from 'react';
import App from '../../App';
import useTheme from '../../hooks/useTheme';
// import { darkTheme, lightTheme } from "@transferto/shared/src/theme/index"
import BG from '../../assets/bg/bg-net.svg';

const AppContainer = styled('div')({
  background: `linear-gradient(180deg, #fefaff 9.96%, #fbebff 100%)`,
  backgroundImage: `url(${BG}), linear-gradient(180deg, #fefaff 9.96%, #fbebff 100%) !important`,
  backgroundSize: 'contain !important',
  backgroundRepeat: 'no-repeat !important',
  backgroundPosition: 'bottom !important',
  minHeight: '100vh',
});

const AppWrapper = () => {
  const { isDarkMode } = useTheme();

  // TODO: @Adrian need to import themes from shared package
  const lightTheme = {};
  const darkTheme = {};

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <AppContainer>
        <App />
      </AppContainer>
    </ThemeProvider>
  );
};

export default AppWrapper;
