import acceptLanguage from 'accept-language';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { locales } from './i18n/i18next-locales';
import { cookieName, fallbackLng } from './i18n/i18next-settings';

acceptLanguage.languages(locales);

export const config = {
  // matcher: '/:lng*'
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)'],
};

export function middleware(req: NextRequest) {
  let lng;
  if (req.cookies.has(cookieName)) {
    const cookieValue = req.cookies.get(cookieName)?.value;
    if (cookieValue && cookieValue !== 'undefined') {
      lng = acceptLanguage.get(req.cookies.get(cookieName)?.value);
    }
  }
  if (!lng) {
    lng = acceptLanguage.get(req.headers.get('Accept-Language'));
  }
  if (!lng) {
    lng = fallbackLng;
  }

  // Redirect if lng in path is not supported
  if (
    !locales.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !req.nextUrl.pathname.startsWith('/_next')
  ) {
    console.log('REDIRECT LNG', lng);
    return NextResponse.redirect(
      new URL(`/${lng}${req.nextUrl.pathname}`, req.url),
    );
  }
  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer') || '');
    const lngInReferer = locales.find((l) =>
      refererUrl.pathname.startsWith(`/${l}`),
    );
    const response = NextResponse.next();
    if (lngInReferer) {
      response.cookies.set(cookieName, lngInReferer);
    }
    return response;
  }

  return NextResponse.next();
}
