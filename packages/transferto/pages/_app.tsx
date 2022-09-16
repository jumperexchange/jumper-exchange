// i18n
import '../src/locales/i18n';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import cookie from 'cookie';

// Images:
import { SettingsValueProps } from '@transferto/shared/src';
import { SettingsProvider } from '@transferto/shared/src';
import { getSettings } from '@transferto/shared/src';
import { NextPage } from 'next';
import App, { AppContext, AppProps } from 'next/app';
import { ReactElement, ReactNode } from 'react';
import { lightTheme, darkTheme } from '@transferto/shared/src';
import useMediaQuery from '@mui/material/useMediaQuery';
import Navbar from '../src/organisms/navbar';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface MyAppProps extends AppProps {
  settings: SettingsValueProps;
  Component: NextPageWithLayout;
}

function MyApp({ Component, pageProps, settings }: MyAppProps) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  return (
    <ThemeProvider theme={prefersDarkMode ? darkTheme : lightTheme}>
      <SettingsProvider defaultSettings={settings}>
        <CssBaseline>
          <Navbar />
          <Component {...pageProps} />
        </CssBaseline>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default MyApp;

// ----------------------------------------------------------------------

MyApp.getInitialProps = async (context: AppContext) => {
  const appProps = await App.getInitialProps(context);

  const cookies = cookie.parse(
    context.ctx.req ? context.ctx.req.headers.cookie || '' : document.cookie,
  );

  const settings = getSettings(cookies);

  return {
    ...appProps,
    settings,
  };
};
