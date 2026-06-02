import type { NextRequest } from 'next/server';

export const isSafeInternalPathname = (pathname: string): boolean => {
  return pathname.startsWith('/') && !pathname.startsWith('//');
};

/** Build a same-origin URL for middleware redirects/rewrites (avoids open redirects). */
export const buildSameOriginRequestUrl = (
  request: NextRequest,
  pathname: string,
  search: string = request.nextUrl.search,
): URL => {
  const url = new URL(request.url);
  url.pathname = isSafeInternalPathname(pathname) ? pathname : '/';
  url.search = search;
  return url;
};
