// middleware.ts
import acceptLanguage from 'accept-language';
import { i18nRouter } from 'next-i18n-router';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import i18nConfig from '../i18nconfig';
import { locales } from './i18n/i18next-locales';

acceptLanguage.languages(locales);

export function middleware(request: NextRequest) {
  const url = new URL(request.url);

  // Check if the pathname ends with a slash or if it's a file (contains a dot)
  if (!url.pathname.endsWith('/') && !url.pathname.includes('.')) {
    url.pathname += '/';
    return NextResponse.redirect(url);
  }

  // If the URL is already correctly formatted, proceed with i18nRouter
  return i18nRouter(request, i18nConfig);
}

// Applies this middleware only to specific paths
export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)',
};
