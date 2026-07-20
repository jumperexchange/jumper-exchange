import { useToken } from '@/hooks/useToken';
import { zeroAddress, type Address } from 'viem';
import type { EarnOpportunityWithLatestAnalytics } from 'src/types/jumper-backend';

export type VaultCapacityDisplay =
  | { state: 'unknown' }
  | { state: 'unlimited' }
  | {
      state: 'capped';
      maxUsd: number;
      remainingUsd?: number;
    }
  | {
      state: 'capped-native';
      max: number;
      remaining?: number;
      symbol: string;
    };

const parseUintString = (value: string | undefined): bigint | undefined => {
  if (!value) {
    return undefined;
  }
  try {
    const parsed = BigInt(value);
    return parsed >= 0n ? parsed : undefined;
  } catch {
    return undefined;
  }
};

/**
 * Resolves a vault's capacity into a display-ready shape, hiding the price
 * fetch, the deprecated `capInDollar` fallback, and the upstream data quirks
 * (uint256-max sentinel, `0`/malformed values) behind a single call.
 *
 * Pass `enabled: false` when the caller won't display capacity (e.g. compact
 * / list-item cards) so the token price isn't fetched needlessly.
 */
export const useVaultCapacity = (
  earnOpportunity: EarnOpportunityWithLatestAnalytics | null | undefined,
  { enabled }: { enabled: boolean },
): VaultCapacityDisplay => {
  const capacity = earnOpportunity?.capacity;
  const asset = earnOpportunity?.asset;
  const capInDollar = earnOpportunity?.capInDollar;

  const max = capacity && !capacity.unlimited ? capacity.max : undefined;
  const remaining =
    capacity && !capacity.unlimited ? capacity.remaining : undefined;
  const maxAmount = parseUintString(max);
  const remainingAmount = parseUintString(remaining);
  const hasValidCappedCapacity =
    !!capacity &&
    !capacity.unlimited &&
    maxAmount !== undefined &&
    maxAmount > 0n &&
    remainingAmount !== undefined;

  const needsPrice = enabled && hasValidCappedCapacity;
  const chainId = asset?.chain.chainId ?? 0;
  const address = (asset?.address as Address | undefined) ?? zeroAddress;

  const { token } = useToken(chainId, address, {
    extended: true,
    enabled: needsPrice,
  });

  if (!capacity) {
    if (capInDollar) {
      const maxUsd = Number(capInDollar);
      return Number.isNaN(maxUsd) || maxUsd <= 0
        ? { state: 'unknown' }
        : { state: 'capped', maxUsd };
    }
    return { state: 'unknown' };
  }

  if (capacity.unlimited) {
    return { state: 'unlimited' };
  }

  if (!hasValidCappedCapacity || maxAmount === undefined) {
    return { state: 'unknown' };
  }

  const decimals = asset?.decimals ?? 18;
  const nativeMax = Number(maxAmount) / 10 ** decimals;
  const nativeRemaining =
    remainingAmount !== undefined
      ? Number(remainingAmount) / 10 ** decimals
      : undefined;

  const priceUSD = token?.hasPriceUSD() ? Number(token.priceUSD) : undefined;
  if (priceUSD) {
    return {
      state: 'capped',
      maxUsd: nativeMax * priceUSD,
      remainingUsd:
        nativeRemaining !== undefined ? nativeRemaining * priceUSD : undefined,
    };
  }

  return {
    state: 'capped-native',
    max: nativeMax,
    remaining: nativeRemaining,
    symbol: asset?.symbol ?? '',
  };
};
