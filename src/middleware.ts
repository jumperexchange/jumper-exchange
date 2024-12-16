// middleware.ts
import acceptLanguage from 'accept-language';
import { i18nRouter } from 'next-i18n-router';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import i18nConfig from '../i18nconfig';
import { locales } from './i18n/i18next-locales';

acceptLanguage.languages(locales);

export function middleware(request: NextRequest) {
  const response = i18nRouter(request, i18nConfig);

  // Set a cookie with the pathname that was used on the first page load
  const pathname = request.nextUrl.pathname;
  response.cookies.set('pathname', pathname, { path: '/', sameSite: 'strict' });

  return response;
}

// Applies this middleware only to specific paths
export const config = {
  matcher:
    '/((?!api|static|_next|favicon\\.ico|.*\\.(?:png|jp?eg|gif|webp|svg|ico|xml|riv)).*)',
};
