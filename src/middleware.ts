// middleware.ts
import acceptLanguage from 'accept-language';
import { i18nRouter } from 'next-i18n-router';
import type { NextRequest } from 'next/server';
import i18nConfig from '../i18nconfig';
import { locales } from './i18n/i18next-locales';

acceptLanguage.languages(locales);

export function middleware(request: NextRequest) {
  request.headers.set('x-current-url', request.url);

  return i18nRouter(request, i18nConfig);
}

// applies this middleware only to files in the app directory
export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)',
};
