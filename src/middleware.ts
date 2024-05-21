// middleware.ts
import acceptLanguage from 'accept-language';
import { i18nRouter } from 'next-i18n-router';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import i18nConfig from '../i18nconfig';
import { locales } from './i18n/i18next-locales';

acceptLanguage.languages(locales);

export function middleware(request: NextRequest) {
  // Extract the URL path
  const urlPath = request.nextUrl.pathname;

  // Check if the path is either "/exchange" or "/swap"
  if (urlPath.includes('/exchange/') || urlPath.includes('/swap/')) {
    // Redirect to the root path "/"
    return NextResponse.redirect(new URL('/', request.url));
  }
  // Check if the path is either "/gas"
  if (urlPath.includes('/refuel/')) {
    // Redirect to the default gas-tab "/refuel"
    return NextResponse.redirect(new URL('/gas', request.url));
  }

  // Proceed with the i18nRouter middleware if no redirection occurs
  return i18nRouter(request, i18nConfig);
}

// Applies this middleware only to specific paths
export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)',
};
