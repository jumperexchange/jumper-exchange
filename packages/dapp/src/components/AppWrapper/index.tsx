import { ThemeProvider } from '@emotion/react';
import styled from '@emotion/styled';
import { CssBaseline } from '@mui/material';
import React from 'react';
import App from '../../App';
import useTheme from '../../hooks/useTheme';
// import { darkTheme, lightTheme } from "@transferto/shared/src/theme/index"

const AppContainer = styled('div')`
  background: linear-gradient(180deg, #fefaff 9.96%, #fbebff 100%);
  height: 100vh;
  width: 100vw;
`;

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
