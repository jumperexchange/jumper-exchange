import { useQuery } from '@tanstack/react-query';
import { fetchSpindlCards } from '@/hooks/feature-cards/spindl/fetchSpindlCards';
import { spindlItemToCardData } from '@/hooks/feature-cards/spindl/spindlMapper';
import type { SpindlCardData } from '@/types/spindl';
import { isSpindlFetchResponse } from '@/types/spindl';

// Chain IDs matching @lifi/sdk ChainId enum values (ETH, ARB, OPT, POL, Base)
const ETH = 1;
const ARB = 42161;
const OPT = 10;
const POL = 137;
const BAS = 8453;

// Well-known USDC contract addresses per chain
const USDC: Record<number, string> = {
  [ETH]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  [ARB]: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
  [OPT]: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
  [BAS]: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
};

// Native token sentinel used by the LI.FI ecosystem
const NATIVE = '0x0000000000000000000000000000000000000000';

interface MatrixEntry {
  chainId: number;
  tokenAddress: string;
  label: string;
}

export const SPINDL_STORYBOOK_MATRIX: MatrixEntry[] = [
  { chainId: ETH, tokenAddress: USDC[ETH], label: 'ETH / USDC' },
  { chainId: ETH, tokenAddress: NATIVE, label: 'ETH / native' },
  { chainId: ARB, tokenAddress: USDC[ARB], label: 'ARB / USDC' },
  { chainId: ARB, tokenAddress: NATIVE, label: 'ARB / native' },
  { chainId: OPT, tokenAddress: USDC[OPT], label: 'OPT / USDC' },
  { chainId: OPT, tokenAddress: NATIVE, label: 'OPT / native' },
  { chainId: BAS, tokenAddress: USDC[BAS], label: 'Base / USDC' },
  { chainId: BAS, tokenAddress: NATIVE, label: 'Base / native' },
  { chainId: POL, tokenAddress: NATIVE, label: 'POL / native' },
];

const STALE_TIME_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Fans out Spindl /render/jumper calls across the curated matrix,
 * flattens and deduplicates by item.id (first occurrence wins).
 * Storybook-only — not used in production.
 */
export const useSpindlMatrixCards = (
  country: string,
): { cards: SpindlCardData[]; isLoading: boolean; errorCount: number } => {
  const { data, isLoading } = useQuery({
    queryKey: ['spindl-storybook-matrix', country],
    queryFn: async () => {
      const results = await Promise.allSettled(
        SPINDL_STORYBOOK_MATRIX.map(({ chainId, tokenAddress }) =>
          fetchSpindlCards({ chainId, tokenAddress, country }),
        ),
      );

      let errorCount = results.filter((r) => r.status === 'rejected').length;

      const seen = new Set<string>();
      const cards: SpindlCardData[] = [];
      let flatIndex = 0;

      for (const result of results) {
        if (result.status === 'fulfilled') {
          if (!isSpindlFetchResponse(result.value)) {
            errorCount += 1;
            continue;
          }
          for (const item of result.value.items) {
            if (!seen.has(item.id)) {
              seen.add(item.id);
              cards.push(spindlItemToCardData(item, flatIndex++));
            }
          }
        }
      }

      return { cards, errorCount };
    },
    staleTime: STALE_TIME_MS,
  });

  return {
    cards: data?.cards ?? [],
    isLoading,
    errorCount: data?.errorCount ?? 0,
  };
};
