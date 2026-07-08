import { getChainsQuery } from '@/hooks/useChains';
import { fetchTokensForPage } from '@/app/lib/tokens/cachedTokensFetch';
import { getChainByName } from '@/utils/tokenAndChain';
import { bridgeSegmentsSchema, slugToLabel } from '@/utils/validation-schemas';
import {
  getBridgeSitemapChunkCount,
  getBridgeSitemapChunkIds,
  getBridgeSitemapEntriesForChunk,
  isBridgeSitemapChunkInRange,
  SITEMAP_LIMIT,
} from '@/utils/sitemaps/bridge';
import type { ExtendedChain, Token } from '@lifi/sdk';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/config/env-config', () => ({
  default: {
    NEXT_PUBLIC_VERCEL_BRANCH_URL: '',
    NEXT_PUBLIC_SITE_URL: 'https://jumper.xyz',
  },
}));

vi.mock('@/hooks/useChains', () => ({
  getChainsQuery: vi.fn(),
}));

vi.mock('@/app/lib/tokens/cachedTokensFetch', () => ({
  fetchTokensForPage: vi.fn(),
}));

vi.mock('@/utils/coins', () => ({
  default: [
    { chainId: 1, symbol: 'ETH', address: '0x1', decimals: 18 },
    { chainId: 42161, symbol: 'ETH', address: '0x2', decimals: 18 },
    { chainId: 42161, symbol: 'USDC', address: '0x3', decimals: 6 },
  ],
}));

const mockChains: ExtendedChain[] = [
  {
    id: 1,
    name: 'Ethereum',
    key: 'eth',
    chainType: 'EVM',
    nativeToken: { symbol: 'ETH' },
  } as ExtendedChain,
  {
    id: 42161,
    name: 'Arbitrum One',
    key: 'arb',
    chainType: 'EVM',
    nativeToken: { symbol: 'ETH' },
  } as ExtendedChain,
];

const mockTokens: Record<number, Token[]> = {
  1: [
    {
      chainId: 1,
      symbol: 'ETH',
      address: '0x1',
      decimals: 18,
    } as Token,
  ],
  42161: [
    {
      chainId: 42161,
      symbol: 'ETH',
      address: '0x2',
      decimals: 18,
    } as Token,
    {
      chainId: 42161,
      symbol: 'USDC',
      address: '0x3',
      decimals: 6,
    } as Token,
  ],
};

describe('bridge sitemap generation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getChainsQuery).mockResolvedValue({ chains: mockChains });
    vi.mocked(fetchTokensForPage).mockResolvedValue(mockTokens);
  });

  it('returns chunk ids for filtered cross-chain pairs', async () => {
    const chunkIds = await getBridgeSitemapChunkIds();

    expect(chunkIds).toEqual(['0']);
  });

  it('computes chunk count from pair total', async () => {
    const chunkCount = await getBridgeSitemapChunkCount();

    expect(chunkCount).toBe(1);
  });

  it('slices entries to the requested chunk', async () => {
    const entries = await getBridgeSitemapEntriesForChunk(0);

    expect(entries).toHaveLength(4);
    expect(entries[0]?.loc).toContain(
      '/bridge/ethereum-eth-to-arbitrum-one-eth',
    );
  });

  it('returns empty entries for out-of-range chunks', async () => {
    const entries = await getBridgeSitemapEntriesForChunk(99);

    expect(entries).toEqual([]);
  });

  it('marks out-of-range chunk indices as invalid', async () => {
    await expect(isBridgeSitemapChunkInRange(0)).resolves.toBe(true);
    await expect(isBridgeSitemapChunkInRange(99)).resolves.toBe(false);
    await expect(isBridgeSitemapChunkInRange(-1)).resolves.toBe(false);
  });

  it('round-trips sitemap loc segments through bridge route parsing', async () => {
    const entries = await getBridgeSitemapEntriesForChunk(0);

    for (const entry of entries) {
      const segments = entry.loc.split('/bridge/')[1];
      expect(segments).toBeDefined();

      const parsed = bridgeSegmentsSchema.safeParse(segments);
      expect(parsed.success).toBe(true);

      if (!parsed.success) {
        continue;
      }

      const sourceChain = getChainByName(
        mockChains,
        slugToLabel(parsed.data.sourceChain),
      );
      const destinationChain = getChainByName(
        mockChains,
        slugToLabel(parsed.data.destinationChain),
      );

      expect(sourceChain).toBeDefined();
      expect(destinationChain).toBeDefined();
    }
  });
});

describe('bridge sitemap chunk sizing', () => {
  it('exports the sitemap limit used for chunking', () => {
    expect(SITEMAP_LIMIT).toBe(10_000);
  });
});
