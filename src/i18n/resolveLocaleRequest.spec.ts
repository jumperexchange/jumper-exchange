import {
  buildInternalLocalePath,
  buildLocalizedPublicPath,
  getPathLocale,
  isDirectDocumentAccess,
  resolveLocaleRouting,
} from './resolveLocaleRequest';

const defaultLocale = 'en';
const origin = 'https://jumper.xyz';
const locales = [
  'bn',
  'en',
  'es',
  'fr',
  'id',
  'it',
  'ja',
  'ko',
  'pt',
  'th',
  'tr',
  'uk',
  'vi',
  'zh',
];

describe('getPathLocale', () => {
  it('returns the locale segment when present', () => {
    expect(getPathLocale('/fr/portfolio', locales)).toBe('fr');
    expect(getPathLocale('/it/missions', locales)).toBe('it');
  });

  it('returns undefined for unprefixed paths', () => {
    expect(getPathLocale('/missions', locales)).toBeUndefined();
    expect(getPathLocale('/portfolio', locales)).toBeUndefined();
  });
});

describe('isDirectDocumentAccess', () => {
  it('treats missing or external referers as direct access', () => {
    expect(isDirectDocumentAccess(null, origin)).toBe(true);
    expect(isDirectDocumentAccess('https://google.com', origin)).toBe(true);
  });

  it('treats same-origin referers as in-app navigation', () => {
    expect(isDirectDocumentAccess(`${origin}/fr/swap`, origin)).toBe(false);
    expect(isDirectDocumentAccess(`${origin}/missions`, origin)).toBe(false);
  });
});

describe('buildLocalizedPublicPath', () => {
  it('keeps default locale paths unlocalised', () => {
    expect(buildLocalizedPublicPath('/portfolio', 'en', defaultLocale)).toBe(
      '/portfolio',
    );
    expect(buildLocalizedPublicPath('/', 'en', defaultLocale)).toBe('/');
  });

  it('prefixes non-default locales', () => {
    expect(buildLocalizedPublicPath('/portfolio', 'fr', defaultLocale)).toBe(
      '/fr/portfolio',
    );
    expect(buildLocalizedPublicPath('/', 'fr', defaultLocale)).toBe('/fr');
  });
});

describe('buildInternalLocalePath', () => {
  it('builds internal app-router locale paths', () => {
    expect(buildInternalLocalePath('/missions', 'en')).toBe('/en/missions');
    expect(buildInternalLocalePath('/missions', 'fr')).toBe('/fr/missions');
    expect(buildInternalLocalePath('/', 'fr')).toBe('/fr');
  });
});

describe('resolveLocaleRouting', () => {
  const baseParams = {
    locales,
    defaultLocale,
    detectorLocale: defaultLocale,
    referer: null,
    requestOrigin: origin,
    isSoftNavigation: false,
  };

  it('keeps unprefixed paths in English on direct access when a locale cookie is present', () => {
    expect(
      resolveLocaleRouting({
        ...baseParams,
        pathname: '/missions',
        cookie: 'fr',
      }),
    ).toEqual({
      serveLocale: 'en',
      action: 'rewrite',
      targetPath: '/missions',
    });

    expect(
      resolveLocaleRouting({
        ...baseParams,
        pathname: '/portfolio',
        cookie: 'fr',
      }),
    ).toEqual({
      serveLocale: 'en',
      action: 'rewrite',
      targetPath: '/portfolio',
    });
  });

  it('redirects english-prefixed paths to unlocalised URLs when a locale cookie is present', () => {
    expect(
      resolveLocaleRouting({
        ...baseParams,
        pathname: '/en/missions',
        cookie: 'fr',
      }),
    ).toEqual({
      serveLocale: 'en',
      action: 'redirect',
      targetPath: '/missions',
    });

    expect(
      resolveLocaleRouting({
        ...baseParams,
        pathname: '/en/portfolio',
        cookie: 'fr',
      }),
    ).toEqual({
      serveLocale: 'en',
      action: 'redirect',
      targetPath: '/portfolio',
    });
  });

  it('redirects in-app navigations using the locale cookie', () => {
    expect(
      resolveLocaleRouting({
        ...baseParams,
        pathname: '/portfolio',
        cookie: 'fr',
        referer: `${origin}/fr/swap`,
      }),
    ).toEqual({
      serveLocale: 'fr',
      action: 'redirect',
      targetPath: '/fr/portfolio',
    });

    expect(
      resolveLocaleRouting({
        ...baseParams,
        pathname: '/portfolio',
        cookie: 'fr',
        isSoftNavigation: true,
      }),
    ).toEqual({
      serveLocale: 'fr',
      action: 'redirect',
      targetPath: '/fr/portfolio',
    });
  });

  it('serves explicit URL locales without applying the cookie', () => {
    expect(
      resolveLocaleRouting({
        ...baseParams,
        pathname: '/it/missions',
        cookie: 'fr',
      }),
    ).toEqual({
      serveLocale: 'it',
      action: 'rewrite',
      targetPath: '/it/missions',
    });
  });

  it('serves menu-selected locale paths from the URL', () => {
    expect(
      resolveLocaleRouting({
        ...baseParams,
        pathname: '/fr/missions',
        cookie: 'fr',
      }),
    ).toEqual({
      serveLocale: 'fr',
      action: 'rewrite',
      targetPath: '/fr/missions',
    });
  });

  it('uses Accept-Language detection when no cookie is present', () => {
    expect(
      resolveLocaleRouting({
        ...baseParams,
        pathname: '/portfolio',
        cookie: undefined,
        detectorLocale: 'it',
      }),
    ).toEqual({
      serveLocale: 'it',
      action: 'redirect',
      targetPath: '/it/portfolio',
    });
  });

  it('rewrites unprefixed default-locale paths when no cookie is present', () => {
    expect(
      resolveLocaleRouting({
        ...baseParams,
        pathname: '/portfolio',
        cookie: undefined,
        detectorLocale: 'en',
      }),
    ).toEqual({
      serveLocale: 'en',
      action: 'rewrite',
      targetPath: '/portfolio',
    });
  });
});
