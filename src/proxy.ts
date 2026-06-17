// middleware.ts
import acceptLanguage from 'accept-language';
import { i18nRouter } from 'next-i18n-router';
import type { NextRequest } from 'next/server';
import i18nConfig from 'i18n-config';
import { cookieName } from '@/i18n/i18next-settings';
import { lookupI18nLocaleDetector } from './i18n/lookupI18nLocaleDetector';
import { locales } from './i18n/i18next-locales';

acceptLanguage.languages(locales);

export function proxy(request: NextRequest) {
  const response = i18nRouter(request, {
    ...i18nConfig,
    localeDetector: lookupI18nLocaleDetector,
    serverSetCookie: 'if-empty',
  });

  const storedLocale = request.cookies.get(cookieName)?.value;
  if (storedLocale && !i18nConfig.locales.includes(storedLocale)) {
    response.cookies.set(cookieName, '', {
      path: '/',
      maxAge: 0,
      sameSite: 'lax',
      secure: true,
    });
  }

  // Set once on first page load; re-setting on every request causes cf-cache-status: BYPASS
  if (!request.cookies.get('pathname')?.value) {
    response.cookies.set('pathname', request.nextUrl.pathname, {
      path: '/',
      sameSite: 'strict',
    });
  }

  return response;
}

// Applies this middleware only to specific paths
export const config = {
  matcher:
    '/((?!api|static|_next|favicon\\.ico|.*\\.(?:png|jp?eg|gif|webp|svg|ico|xml|txt|zip|riv|json)).*)',
};
