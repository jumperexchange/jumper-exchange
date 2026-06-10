import { describe, expect, it, vi } from 'vitest';
import {
  buildSitemapIndexXml,
  createSitemapServiceUnavailableResponse,
} from '@/utils/sitemaps/xml';

vi.mock('@/utils/sitemaps/bridge', () => ({
  getBridgeSitemapChunkIds: vi.fn(),
  getBridgeSitemapEntriesForChunk: vi.fn(),
  isBridgeSitemapChunkInRange: vi.fn(),
}));

vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
}));

import { GET } from '@/app/bridge/sitemap/[id]/route';
import { isBridgeSitemapChunkInRange } from '@/utils/sitemaps/bridge';

describe('sitemap xml helpers', () => {
  it('builds a sitemap index document', () => {
    const xml = buildSitemapIndexXml(
      [
        'https://jumper.xyz/bridge/sitemap/0.xml',
        'https://jumper.xyz/bridge/sitemap/1.xml',
      ],
      '2026-06-03',
    );

    expect(xml).toContain('<sitemapindex');
    expect(xml).toContain('<loc>https://jumper.xyz/bridge/sitemap/0.xml</loc>');
    expect(xml).toContain('<lastmod>2026-06-03</lastmod>');
  });

  it('returns a retryable 503 response for sitemap failures', () => {
    const response = createSitemapServiceUnavailableResponse();

    expect(response.status).toBe(503);
    expect(response.headers.get('Retry-After')).toBe('3600');
  });
});

describe('bridge sitemap chunk route', () => {
  it('returns 404 for out-of-range chunk indices', async () => {
    vi.mocked(isBridgeSitemapChunkInRange).mockResolvedValue(false);

    const response = await GET({} as Request, {
      params: Promise.resolve({ id: '99.xml' }),
    });

    expect(response.status).toBe(404);
  });

  it('returns 404 for malformed chunk ids', async () => {
    const response = await GET({} as Request, {
      params: Promise.resolve({ id: 'invalid' }),
    });

    expect(response.status).toBe(404);
  });
});
