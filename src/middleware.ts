// middleware.ts
import acceptLanguage from 'accept-language';
import { i18nRouter } from 'next-i18n-router';
import type { NextRequest } from 'next/server';
import i18nConfig from '../i18nconfig';
import { locales } from './i18n/i18next-locales';

acceptLanguage.languages(locales);

export function middleware(request: NextRequest) {
  return i18nRouter(request, i18nConfig);
}

// Applies this middleware only to specific paths
export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)',
};
