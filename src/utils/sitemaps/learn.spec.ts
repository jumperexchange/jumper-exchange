import { describe, expect, it } from 'vitest';
import { getLearnSitemapPageRange } from '@/utils/sitemaps/learn';

describe('getLearnSitemapPageRange', () => {
  it('returns only the pages needed for a production-sized chunk', () => {
    expect(getLearnSitemapPageRange(0, 771, 50_000, 100)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8,
    ]);
  });

  it('returns a single page for a dev-sized chunk', () => {
    expect(getLearnSitemapPageRange(0, 771, 20, 100)).toEqual([1]);
  });

  it('returns an empty range when the chunk starts past the total', () => {
    expect(getLearnSitemapPageRange(1, 771, 50_000, 100)).toEqual([]);
  });

  it('returns an empty range when there are no articles', () => {
    expect(getLearnSitemapPageRange(0, 0, 50_000, 100)).toEqual([]);
  });
});
