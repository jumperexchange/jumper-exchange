import { NextRequest } from 'next/server';
import { describe, expect, it, vi } from 'vitest';
import { cookieName } from '@/i18n/i18next-settings';

vi.mock('i18n-config', () => ({
  default: {
    locales: [
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
    ],
    defaultLocale: 'en',
  },
}));

import { proxy } from './proxy';

const LOCALE_HEADER = 'x-next-i18n-router-locale';
const ORIGIN = 'https://jumper.xyz';

const createRequest = (
  pathname: string,
  options?: {
    cookie?: string;
    acceptLanguage?: string;
    referer?: string;
  },
): NextRequest => {
  const headers = new Headers();

  if (options?.acceptLanguage) {
    headers.set('accept-language', options.acceptLanguage);
  }

  if (options?.referer) {
    headers.set('referer', options.referer);
  }

  const request = new NextRequest(new URL(`${ORIGIN}${pathname}`), {
    headers,
  });

  if (options?.cookie) {
    request.cookies.set(cookieName, options.cookie);
  }

  return request;
};

describe('proxy locale routing', () => {
  it('rewrites unprefixed paths in English on direct access when a locale cookie is present', () => {
    const response = proxy(createRequest('/missions', { cookie: 'fr' }));

    expect(response.status).toBe(200);
    expect(response.headers.get(LOCALE_HEADER)).toBe('en');
    expect(response.headers.get('x-middleware-rewrite')).toContain(
      '/en/missions',
    );
    expect(response.cookies.has(cookieName)).toBe(false);
  });

  it('redirects english-prefixed paths to unlocalised URLs when a locale cookie is present', () => {
    const response = proxy(createRequest('/en/missions', { cookie: 'fr' }));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(`${ORIGIN}/missions`);
    expect(response.headers.get(LOCALE_HEADER)).toBe('en');
    expect(response.cookies.has(cookieName)).toBe(false);
  });

  it('rewrites explicit non-default URL locales without applying the cookie', () => {
    const response = proxy(createRequest('/it/missions', { cookie: 'fr' }));

    expect(response.status).toBe(200);
    expect(response.headers.get(LOCALE_HEADER)).toBe('it');
    expect(response.headers.get('x-middleware-rewrite')).toContain(
      '/it/missions',
    );
    expect(response.cookies.has(cookieName)).toBe(false);
  });

  it('redirects in-app navigations using the locale cookie', () => {
    const response = proxy(
      createRequest('/portfolio', {
        cookie: 'fr',
        referer: `${ORIGIN}/fr/swap`,
      }),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(`${ORIGIN}/fr/portfolio`);
    expect(response.headers.get(LOCALE_HEADER)).toBe('fr');
    expect(response.cookies.has(cookieName)).toBe(false);
  });

  it('redirects soft navigations using the locale cookie', () => {
    const headers = new Headers({
      RSC: '1',
      referer: `${ORIGIN}/fr/swap`,
    });
    const request = new NextRequest(new URL(`${ORIGIN}/portfolio`), {
      headers,
    });
    request.cookies.set(cookieName, 'fr');

    const response = proxy(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(`${ORIGIN}/fr/portfolio`);
    expect(response.headers.get(LOCALE_HEADER)).toBe('fr');
  });

  it('rewrites menu-selected locale paths from the URL', () => {
    const response = proxy(createRequest('/fr/missions', { cookie: 'fr' }));

    expect(response.status).toBe(200);
    expect(response.headers.get(LOCALE_HEADER)).toBe('fr');
    expect(response.headers.get('x-middleware-rewrite')).toContain(
      '/fr/missions',
    );
    expect(response.cookies.has(cookieName)).toBe(false);
  });

  it('uses Accept-Language when no cookie is present', () => {
    const response = proxy(
      createRequest('/portfolio', { acceptLanguage: 'it-IT,it;q=0.9' }),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(`${ORIGIN}/it/portfolio`);
    expect(response.headers.get(LOCALE_HEADER)).toBe('it');
    expect(response.cookies.has(cookieName)).toBe(false);
  });

  it('does not write NEXT_LOCALE from middleware for shared locale links', () => {
    const response = proxy(createRequest('/fr/missions'));

    expect(response.status).toBe(200);
    expect(response.headers.get(LOCALE_HEADER)).toBe('fr');
    expect(response.cookies.has(cookieName)).toBe(false);
  });

  it('clears invalid locale cookies', () => {
    const response = proxy(createRequest('/missions', { cookie: 'invalid' }));

    expect(response.cookies.get(cookieName)?.value).toBe('');
  });
});
