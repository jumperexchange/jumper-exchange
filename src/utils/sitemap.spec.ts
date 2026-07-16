import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/config/env-config', () => ({
  default: {
    NEXT_PUBLIC_VERCEL_BRANCH_URL: '',
    NEXT_PUBLIC_SITE_URL: 'https://jumper.xyz/',
  },
}));

import { getSiteUrl } from '@/const/urls';
import { buildUrl } from '@/utils/sitemap';

describe('getSiteUrl', () => {
  it('strips trailing slashes from NEXT_PUBLIC_SITE_URL', () => {
    expect(getSiteUrl()).toBe('https://jumper.xyz');
  });
});

describe('buildUrl', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('builds sitemap urls without double slashes when site url has a trailing slash', () => {
    expect(buildUrl('sitemap.xml')).toBe('https://jumper.xyz/sitemap.xml');
    expect(buildUrl('bridge', 'sitemap.xml')).toBe(
      'https://jumper.xyz/bridge/sitemap.xml',
    );
    expect(buildUrl('learn', 'sitemap', '0.xml')).toBe(
      'https://jumper.xyz/learn/sitemap/0.xml',
    );
  });
});
