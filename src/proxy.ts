// middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import i18nConfig from 'i18n-config';
import { cookieName } from '@/i18n/i18next-settings';
import { lookupI18nLocaleDetector } from './i18n/lookupI18nLocaleDetector';
import {
  buildInternalLocalePath,
  isSoftNavigationRequest,
  resolveLocaleRouting,
} from './i18n/resolveLocaleRequest';
import { stripLocaleFromPathname } from './utils/urls/stripLocaleFromPathname';
import { buildSameOriginRequestUrl } from './utils/urls/buildSameOriginRequestUrl';

const LOCALE_HEADER = 'x-next-i18n-router-locale';

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const cookieLocale = request.cookies.get(cookieName)?.value;
  const detectorLocale = lookupI18nLocaleDetector(request, i18nConfig);

  const decision = resolveLocaleRouting({
    pathname,
    cookie: cookieLocale,
    detectorLocale,
    locales: i18nConfig.locales,
    defaultLocale: i18nConfig.defaultLocale,
    referer: request.headers.get('referer'),
    requestOrigin: request.nextUrl.origin,
    isSoftNavigation: isSoftNavigationRequest(request.headers),
  });

  const responseOptions = {
    request: {
      headers: new Headers(request.headers),
    },
  };

  let response: NextResponse;

  if (decision.action === 'redirect') {
    response = NextResponse.redirect(
      buildSameOriginRequestUrl(request, decision.targetPath),
    );
  } else {
    const pathWithoutLocale = stripLocaleFromPathname(decision.targetPath);
    const internalPath = buildInternalLocalePath(
      pathWithoutLocale,
      decision.serveLocale,
    );

    response = NextResponse.rewrite(
      buildSameOriginRequestUrl(request, internalPath),
      responseOptions,
    );
  }

  response.headers.set(LOCALE_HEADER, decision.serveLocale);

  if (cookieLocale && !i18nConfig.locales.includes(cookieLocale)) {
    response.cookies.set(cookieName, '', {
      path: '/',
      maxAge: 0,
      sameSite: 'lax',
      secure: true,
    });
  }

  response.cookies.set('pathname', pathname, { path: '/', sameSite: 'strict' });

  return response;
}

// Applies this middleware only to specific paths
export const config = {
  matcher:
    '/((?!api|static|_next|favicon\\.ico|.*\\.(?:png|jp?eg|gif|webp|svg|ico|xml|txt|zip|riv|json)).*)',
};
