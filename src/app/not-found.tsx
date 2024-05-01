import Link from 'next/link';
import React from 'react';
import { BackgroundGradient } from '@/components/BackgroundGradient';
import { NavbarContainer, LogoLink } from '@/components/Navbar/Navbar.style';
import { PoweredBy } from '@/components/PoweredBy';
import { getCookies } from '@/app/lib/getCookies';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { NavbarButtons } from '@/components/Navbar/NavbarButtons';
import { NotFoundComponent } from '@/components/NotFound/NotFound';
import { defaultNS } from 'src/i18n';
import TranslationsProvider from '@/providers/TranslationProvider';
import { namespaces } from 'src/i18n';
import initTranslations from '@/app/i18n';
import { cookies } from 'next/headers';

export default async function NotFound() {
  const { activeTheme } = getCookies();
  const cookiesHandler = cookies();
  const locale = cookiesHandler.get('NEXT_LOCALE')?.value ?? 'en';

  const { resources } = await initTranslations(locale, namespaces);

  console.log('props', activeTheme, resources)
  const mainCol = activeTheme === 'dark' ? '#BEA0EB' : '#653BA3';
  const subCol = '#8700B8';

  return (
    <>
      <AppRouterCacheProvider>
      <ThemeProvider theme={activeTheme}>
        <TranslationsProvider
          namespaces={[defaultNS]}
          locale={locale}
          resources={resources}
        >
      <BackgroundGradient />

      <NavbarContainer>
        <LogoLink sx={{ height: '32px' }} href="https://jumper.exchange">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="jumper-logo"
            width="100%"
            height="100%"
            fill="none"
          >
            <path
              fill={mainCol}
              d="M17.145 16 5.83 27.314l2.828 2.828c1.414 1.414 4.243 1.414 5.657 0L25.63 18.828c1.414-1.414 1.414-4.242 0-5.656l-5.657-5.657-5.657 5.657L17.145 16Z"
            />
            <path
              fill={subCol}
              d="M5.831 4.686 8.66 1.858c1.415-1.414 4.243-1.414 5.657 0l2.829 2.828-5.657 5.657L5.83 4.686Z"
            />
            <path
              className="jumper-logo-desktop"
              fill={mainCol}
              d="M132.002 18h4v-6h12v-2c0-1-1-2-2-2h-12c-1 0-2 1-2 2v8Z"
            />
            <path
              className="jumper-logo-desktop"
              fill={subCol}
              d="M136.002 24h-2c-1 0-2-1-2-2v-2h4v4Z"
            />
            <path
              className="jumper-logo-desktop"
              fill={mainCol}
              d="M117.002 20v-2.667h10v-2.666h-10V12h12v-2c0-1-1-2-2-2h-12c-1 0-2 1-2 2v12c0 1 1 2 2 2h12c1 0 2-1 2-2v-2h-12Zm-22 0h4v4h-2c-1 0-2-1-2-2v-2Z"
            />
            <path
              className="jumper-logo-desktop"
              fill={mainCol}
              fillRule="evenodd"
              d="M97.002 8c-1 0-2 1-2 2v10h10c4 0 6-3 6-6s-2-6-6-6h-8Zm8 4h-6v4h6c1.5 0 2-1.264 2-2s-.5-2-2-2Z"
              clipRule="evenodd"
            />
            <path
              className="jumper-logo-desktop"
              fill={mainCol}
              d="M92.002 10c0-1-1-2-2-2h-12c-1 0-2 1-2 2v12c0 1 1 2 2 2h2V12h2.5v12h3V12h2.5v12h2c1 0 2-1 2-2V10Zm-34.999 0c0-1 1-2 2-2h2v12h8V8h2c1 0 2 1 2 2v12c0 1-1 2-2 2h-12c-1 0-2-1-2-2V10Z"
            />
            <path
              className="jumper-logo-desktop"
              fill={subCol}
              d="M50.007 8h1.996c1 0 2 1 2 2l.004 2h-4V8Z"
            />
            <path
              className="jumper-logo-desktop"
              fill={mainCol}
              d="M54.007 14h-4v6h-12l-.005 2c0 1 1 2 2 2h12c1 0 2.005-1 2-2l.005-8Z"
            />
            <style type="text/css">
              {`
            .jumper-logo {
              width: 175px;
              height: 32px;
            }
          `}
            </style>
          </svg>
        </LogoLink>
        <NavbarButtons redirectToLearn={false} />
      </NavbarContainer>
          <NotFoundComponent />
        <PoweredBy fixedPosition={true} />

      </TranslationsProvider>
      </ThemeProvider>
      </AppRouterCacheProvider>
    </>
  );
}
