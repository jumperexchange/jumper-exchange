import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';
import {
  buildSameOriginRequestUrl,
  isSafeInternalPathname,
} from './buildSameOriginRequestUrl';

describe('isSafeInternalPathname', () => {
  it('accepts normal internal paths', () => {
    expect(isSafeInternalPathname('/portfolio')).toBe(true);
    expect(isSafeInternalPathname('/fr/missions')).toBe(true);
  });

  it('rejects protocol-relative paths', () => {
    expect(isSafeInternalPathname('//evil.com')).toBe(false);
    expect(isSafeInternalPathname('//evil.com/path')).toBe(false);
  });
});

describe('buildSameOriginRequestUrl', () => {
  const request = new NextRequest(
    new URL('https://jumper.xyz/en/missions?foo=bar'),
  );

  it('keeps redirects on the same origin', () => {
    const url = buildSameOriginRequestUrl(request, '/missions');

    expect(url.origin).toBe('https://jumper.xyz');
    expect(url.pathname).toBe('/missions');
    expect(url.search).toBe('?foo=bar');
  });

  it('falls back to root for unsafe pathnames', () => {
    const url = buildSameOriginRequestUrl(request, '//evil.com/phishing');

    expect(url.origin).toBe('https://jumper.xyz');
    expect(url.pathname).toBe('/');
  });
});
