import { INDEXED_BRIDGE_SEGMENTS } from '@/const/indexedPages';
import { getBridgeSitemapEntries } from '@/utils/sitemaps/bridge';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/config/env-config', () => ({
  default: {
    NEXT_PUBLIC_VERCEL_BRANCH_URL: '',
    NEXT_PUBLIC_SITE_URL: 'https://jumper.xyz',
  },
}));

describe('getBridgeSitemapEntries', () => {
  it('returns one entry per approved bridge segment', () => {
    const entries = getBridgeSitemapEntries('2025-01-01');

    expect(entries).toHaveLength(INDEXED_BRIDGE_SEGMENTS.size);
  });

  it('builds correct URLs for each segment', () => {
    const entries = getBridgeSitemapEntries('2025-01-01');

    for (const entry of entries) {
      expect(entry.loc).toMatch(/^https:\/\/jumper\.xyz\/bridge\//);
    }
  });

  it('uses the provided lastModified date', () => {
    const entries = getBridgeSitemapEntries('2025-06-01');

    expect(entries.every((e) => e.lastModified === '2025-06-01')).toBe(true);
  });
});
