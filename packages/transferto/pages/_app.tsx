// i18n
import "../src/locales/i18n";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

import { theme } from "@transferto/shared/theme";
import cookie from "cookie";

// Images:
import { SettingsValueProps } from "@transferto/shared/components/settings/type";
import { SettingsProvider } from "@transferto/shared/contexts/SettingsContext";
import { getSettings } from "@transferto/shared/utils/getSettings";
import { NextPage } from "next";
import App, { AppContext, AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface MyAppProps extends AppProps {
  settings: SettingsValueProps;
  Component: NextPageWithLayout;
}

function MyApp({ Component, pageProps, settings }: MyAppProps) {
  return (
    <ThemeProvider theme={theme}>
      <SettingsProvider defaultSettings={settings}>
        <CssBaseline>
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
    context.ctx.req ? context.ctx.req.headers.cookie || "" : document.cookie,
  );

  const settings = getSettings(cookies);

  return {
    ...appProps,
    settings,
  };
};
