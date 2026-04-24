import type { ChainSingleSelectValue } from '@/components/composite/JumperWidget/components/Chain';
import type { NumericSelectValue } from '@/components/composite/JumperWidget/components/NumericSelect';
import type { BalancesMultiSelectValue } from '@/components/composite/JumperWidget/components/Balances';
import type { ExtendedChain } from '@lifi/sdk';
import type {
  PortfolioBalance,
  WalletToken,
  ExtendedToken,
} from '@/types/tokens';
import type { Account } from '@lifi/widget-provider';
import { INITIAL_MAX_THRESHOLD_USD, MAX_SELECTABLE_TOKENS } from './constants';
import { checkBalanceWithinRange, getChainMinUsdThreshold } from './utils';
import type { DustSummaryValue } from './dustTypes';

export interface DustFieldDeriveResult {
  threshold: number | undefined;
  chainId: number | undefined;
  isValid: boolean;
}

export const sortByAmountDesc = (
  a: PortfolioBalance<WalletToken>,
  b: PortfolioBalance<WalletToken>,
) => b.amountUSD - a.amountUSD;

export const selectTopAddresses = (
  balances: PortfolioBalance<WalletToken>[],
): string[] =>
  [...balances]
    .sort(sortByAmountDesc)
    .slice(0, MAX_SELECTABLE_TOKENS)
    .map((b) => b.token.address);

export function createDustFieldDerive(
  getValue: (key: string) => unknown,
): DustFieldDeriveResult {
  const threshold = getValue('amountThreshold') as
    | NumericSelectValue
    | undefined;
  const chain = getValue('chain') as ChainSingleSelectValue | undefined;
  const rawId = chain?.selectedChain;
  const chainId =
    rawId != null && !Number.isNaN(Number(rawId)) ? Number(rawId) : undefined;

  return {
    threshold: threshold?.value,
    chainId,
    isValid: !!(threshold?.value != null && chainId != null),
  };
}

export function getFilteredBalances(
  nonNativeBalances: PortfolioBalance<WalletToken>[],
  chainId: number,
  maxUsd: number,
): PortfolioBalance<WalletToken>[] {
  return nonNativeBalances
    .filter((b) => b.token.chainId === chainId)
    .filter((b) =>
      checkBalanceWithinRange(b, maxUsd, getChainMinUsdThreshold(chainId)),
    );
}

export function checkChainHasBalancesBelowThreshold(
  nonNativeBalances: PortfolioBalance<WalletToken>[],
  chainId: number,
  maxUsd: number,
): boolean {
  return getFilteredBalances(nonNativeBalances, chainId, maxUsd).length > 0;
}

export function sumBalanceAmountUsd(
  balances: PortfolioBalance<WalletToken>[],
): number {
  return balances.reduce((sum, b) => sum + b.amountUSD, 0);
}

/** Chains with the largest total non-native (dust) portfolio USD first. */
export function sortChainsByTotalNonNativeUsdDesc(
  chains: ExtendedChain[],
  nonNativeBalances: PortfolioBalance<WalletToken>[],
): ExtendedChain[] {
  const usdByChainId = new Map<number, number>();
  for (const b of nonNativeBalances) {
    const id = b.token.chainId;
    usdByChainId.set(id, (usdByChainId.get(id) ?? 0) + b.amountUSD);
  }
  return [...chains].sort((a, b) => {
    const diff = (usdByChainId.get(b.id) ?? 0) - (usdByChainId.get(a.id) ?? 0);
    return diff !== 0 ? diff : a.id - b.id;
  });
}

/**
 * Order chains by total USD of balances that pass the dust threshold filter
 * (same rule as {@link getFilteredBalances}).
 */
export function sortChainsByFilteredDustUsdDesc(
  chains: ExtendedChain[],
  nonNativeBalances: PortfolioBalance<WalletToken>[],
  maxUsd: number,
): ExtendedChain[] {
  return [...chains].sort((a, b) => {
    const usdB = sumBalanceAmountUsd(
      getFilteredBalances(nonNativeBalances, b.id, maxUsd),
    );
    const usdA = sumBalanceAmountUsd(
      getFilteredBalances(nonNativeBalances, a.id, maxUsd),
    );
    const diff = usdB - usdA;
    return diff !== 0 ? diff : a.id - b.id;
  });
}

export function getDefaultChainAndBalances(
  nonNativeBalances: PortfolioBalance<WalletToken>[],
): { chainId: number | undefined; addresses: string[] } {
  const chainBalanceSums = new Map<number, number>();
  const chainBalances = new Map<number, typeof nonNativeBalances>();

  let maxChainId: number | undefined;
  let maxSum = -Infinity;

  for (const balance of nonNativeBalances) {
    const { chainId } = balance.token;

    if (
      !checkBalanceWithinRange(
        balance,
        INITIAL_MAX_THRESHOLD_USD,
        getChainMinUsdThreshold(chainId),
      )
    ) {
      continue;
    }

    const newSum = (chainBalanceSums.get(chainId) ?? 0) + balance.amountUSD;
    chainBalanceSums.set(chainId, newSum);

    const list = chainBalances.get(chainId) ?? [];
    list.push(balance);
    chainBalances.set(chainId, list);

    if (newSum > maxSum) {
      maxSum = newSum;
      maxChainId = chainId;
    }
  }

  if (maxChainId == null) {
    return { chainId: undefined, addresses: [] };
  }

  return {
    chainId: maxChainId,
    addresses: selectTopAddresses(chainBalances.get(maxChainId) ?? []),
  };
}

export function resolveAccountAddress(
  chainId: number,
  chains: ExtendedChain[],
  accounts: Account[],
): string | undefined {
  const selectedChain = chains.find((c) => c.id === chainId);
  if (!selectedChain) {
    return undefined;
  }
  const account = accounts.find((a) => a.chainType === selectedChain.chainType);

  return account?.address;
}

export function resolveNativeTokenForChain(
  chainId: number,
  nativeExtendedTokens: ExtendedToken[],
  fallbackNativeToken: ExtendedToken,
): ExtendedToken {
  return (
    nativeExtendedTokens.find((t) => t.chainId === chainId) ??
    fallbackNativeToken
  );
}

export interface DustAmountConverters {
  toAmountFromPrice: (amount: string, priceUSD: string) => string;
  toInputAmount: (value: string, usdDecimals: number) => string;
  toRawAmount: (amount: string, decimals: number) => bigint;
  toAggregatedAmountUSD: (balances: PortfolioBalance<WalletToken>[]) => number;
  usdDecimals: number;
}

export function computeDustAmounts(
  filteredBalances: PortfolioBalance<WalletToken>[],
  selectedAddresses: string[],
  token: ExtendedToken,
  c: DustAmountConverters,
) {
  const toTokenStr = (usd: number) =>
    c.toAmountFromPrice(
      c.toInputAmount(usd.toLocaleString('fullwide'), c.usdDecimals),
      token.priceUSD,
    );

  const maxAmountUSD = c.toAggregatedAmountUSD(filteredBalances);
  const amountUSD = c.toAggregatedAmountUSD(
    filteredBalances.filter((b) => selectedAddresses.includes(b.token.address)),
  );

  return {
    amount: c.toRawAmount(toTokenStr(amountUSD), token.decimals).toString(),
    maxAmount: c
      .toRawAmount(toTokenStr(maxAmountUSD), token.decimals)
      .toString(),
  };
}

export function dustSummaryContentEqual(
  prev: DustSummaryValue,
  next: DustSummaryValue,
): boolean {
  return (
    prev.amount === next.amount &&
    prev.amountUSD === next.amountUSD &&
    prev.nativeToken.chainId === next.nativeToken.chainId &&
    prev.selectedBalances.length === next.selectedBalances.length &&
    prev.selectedBalances.every(
      (b, i) => b.token.address === next.selectedBalances[i].token.address,
    )
  );
}

export function getBalancesFieldValue(
  getValue: (key: string) => unknown,
): BalancesMultiSelectValue | undefined {
  return getValue('balances') as BalancesMultiSelectValue | undefined;
}
