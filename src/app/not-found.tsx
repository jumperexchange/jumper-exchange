import { Link } from '@mui/material';
import React from 'react';
import { BackgroundGradient } from '@/components/BackgroundGradient';
import { NavbarContainer } from '@/components/Navbar/Navbar.style';
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
import { Logo } from '@/components/Navbar/Logo/Logo';
import RouterLink from 'next/link';

export default async function NotFound() {
  const { activeTheme } = getCookies();
  const cookiesHandler = cookies();
  const locale = cookiesHandler.get('NEXT_LOCALE')?.value ?? 'en';

  const { resources } = await initTranslations(locale, namespaces);

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
              <Link component={RouterLink} href="/">
                <Logo variant="default" />
              </Link>
              <NavbarButtons redirectToLearn={false} />
            </NavbarContainer>
            <NotFoundComponent />
            {/*<Image src={'/bg-notfound.webp'} alt="404" width={300} height={300} />*/}
            <PoweredBy fixedPosition={true} />
          </TranslationsProvider>
        </ThemeProvider>
      </AppRouterCacheProvider>
    </>
  );
}
