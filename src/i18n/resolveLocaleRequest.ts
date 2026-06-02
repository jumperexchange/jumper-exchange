import { stripLocaleFromPathname } from '@/utils/urls/stripLocaleFromPathname';

export type LocaleRoutingAction = 'rewrite' | 'redirect';

export type LocaleRoutingDecision = {
  serveLocale: string;
  action: LocaleRoutingAction;
  /** Public URL shown in the browser */
  targetPath: string;
};

export type ResolveLocaleRoutingParams = {
  pathname: string;
  cookie: string | undefined;
  detectorLocale: string;
  locales: readonly string[];
  defaultLocale: string;
  referer: string | null;
  requestOrigin: string;
  isSoftNavigation: boolean;
};

export const getPathLocale = (
  pathname: string,
  locales: readonly string[],
): string | undefined => {
  const segment = pathname.split('/')[1];
  if (segment && locales.includes(segment)) {
    return segment;
  }
  return undefined;
};

export const isDirectDocumentAccess = (
  referer: string | null,
  requestOrigin: string,
): boolean => {
  if (!referer) {
    return true;
  }

  try {
    return new URL(referer).origin !== requestOrigin;
  } catch {
    return true;
  }
};

export const isSoftNavigationRequest = (headers: Headers): boolean => {
  if (headers.get('RSC') === '1') {
    return true;
  }

  if (headers.get('Next-Router-Prefetch') === '1') {
    return true;
  }

  return headers.has('Next-Router-State-Tree');
};

export const shouldApplyPersistedLocale = ({
  referer,
  requestOrigin,
  isSoftNavigation,
}: {
  referer: string | null;
  requestOrigin: string;
  isSoftNavigation: boolean;
}): boolean => {
  if (isSoftNavigation) {
    return true;
  }

  return !isDirectDocumentAccess(referer, requestOrigin);
};

export const buildLocalizedPublicPath = (
  pathWithoutLocale: string,
  locale: string,
  defaultLocale: string,
): string => {
  if (locale === defaultLocale) {
    return pathWithoutLocale;
  }

  if (pathWithoutLocale === '/') {
    return `/${locale}`;
  }

  return `/${locale}${pathWithoutLocale}`;
};

export const buildInternalLocalePath = (
  pathWithoutLocale: string,
  locale: string,
): string => {
  if (pathWithoutLocale === '/') {
    return `/${locale}`;
  }

  return `/${locale}${pathWithoutLocale}`;
};

const isDefaultLocalePrefixedPath = (
  pathname: string,
  fallbackLocale: string,
): boolean => {
  return (
    pathname === `/${fallbackLocale}` ||
    pathname.startsWith(`/${fallbackLocale}/`)
  );
};

const resolveUnlocalisedDefaultRouting = (
  pathname: string,
  fallbackLocale: string,
): LocaleRoutingDecision => {
  const unlocalisedPath = isDefaultLocalePrefixedPath(pathname, fallbackLocale)
    ? stripLocaleFromPathname(pathname)
    : pathname;

  if (unlocalisedPath !== pathname) {
    return {
      serveLocale: fallbackLocale,
      action: 'redirect',
      targetPath: unlocalisedPath,
    };
  }

  return {
    serveLocale: fallbackLocale,
    action: 'rewrite',
    targetPath: pathname,
  };
};

const resolveUnprefixedRouting = (
  params: ResolveLocaleRoutingParams,
): LocaleRoutingDecision => {
  const {
    pathname,
    cookie,
    detectorLocale,
    locales,
    defaultLocale,
    referer,
    requestOrigin,
    isSoftNavigation,
  } = params;

  const validCookie = cookie && locales.includes(cookie) ? cookie : undefined;

  if (
    validCookie &&
    shouldApplyPersistedLocale({ referer, requestOrigin, isSoftNavigation })
  ) {
    const publicPath = buildLocalizedPublicPath(
      pathname,
      validCookie,
      defaultLocale,
    );

    if (publicPath === pathname) {
      return {
        serveLocale: validCookie,
        action: 'rewrite',
        targetPath: pathname,
      };
    }

    return {
      serveLocale: validCookie,
      action: 'redirect',
      targetPath: publicPath,
    };
  }

  if (validCookie) {
    return resolveUnlocalisedDefaultRouting(pathname, defaultLocale);
  }

  const locale = locales.includes(detectorLocale)
    ? detectorLocale
    : defaultLocale;
  const publicPath = buildLocalizedPublicPath(pathname, locale, defaultLocale);

  if (publicPath === pathname) {
    return {
      serveLocale: locale,
      action: 'rewrite',
      targetPath: pathname,
    };
  }

  return {
    serveLocale: locale,
    action: 'redirect',
    targetPath: publicPath,
  };
};

export const resolveLocaleRouting = (
  params: ResolveLocaleRoutingParams,
): LocaleRoutingDecision => {
  const { pathname, locales, defaultLocale } = params;
  const pathLocale = getPathLocale(pathname, locales);

  if (pathLocale === defaultLocale) {
    return resolveUnlocalisedDefaultRouting(pathname, defaultLocale);
  }

  if (pathLocale) {
    return {
      serveLocale: pathLocale,
      action: 'rewrite',
      targetPath: pathname,
    };
  }

  return resolveUnprefixedRouting(params);
};
