import { useMemo } from 'react';
import {
  dedupTokensFromLpPositions,
  toWalletPortfolioBalances,
  balanceAccessors,
  extractBalancesMetadata,
} from '../utils';
import { useBalancesData } from './useBalancesData';
import mapValues from 'lodash/mapValues';
import orderBy from 'lodash/orderBy';
import groupBy from 'lodash/groupBy';
import { useChains } from '@/hooks/useChains';
import type { PortfolioBalance, PositionToken } from '@/types/tokens';

export const useProcessBalances = (
  lpTokens: PortfolioBalance<PositionToken>[],
) => {
  const rawData = useBalancesData();
  const { chains } = useChains();

  const balances = useMemo(
    () => toWalletPortfolioBalances(rawData.balances, chains),
    [rawData.balances, chains],
  );

  const balancesByAddress = useMemo(() => {
    return mapValues(rawData.balancesByAddress, (balances) =>
      toWalletPortfolioBalances(balances, chains),
    );
  }, [rawData.balancesByAddress, chains]);

  const dedupedBalances = useMemo(
    () => dedupTokensFromLpPositions(balances, lpTokens),
    [balances, lpTokens],
  );

  const dedupedBalancesByAddress = useMemo(
    () =>
      mapValues(balancesByAddress, (balances) =>
        dedupTokensFromLpPositions(balances, lpTokens),
      ),
    [balancesByAddress, lpTokens],
  );

  const groupedBalances = useMemo(
    () =>
      groupBy(
        orderBy(dedupedBalances, [balanceAccessors.amountUSD], ['desc']),
        balanceAccessors.symbol,
      ),
    [dedupedBalances],
  );

  const groupedBalancesByAddress = useMemo(
    () =>
      mapValues(dedupedBalancesByAddress, (addrBalances) =>
        groupBy(
          orderBy(addrBalances, [balanceAccessors.amountUSD], ['desc']),
          balanceAccessors.symbol,
        ),
      ),
    [dedupedBalancesByAddress],
  );

  const metadata = useMemo(
    () => extractBalancesMetadata(groupedBalancesByAddress),
    [groupedBalancesByAddress],
  );

  const isEmpty = dedupedBalances.length === 0;

  return useMemo(
    () => ({
      ...rawData,
      balances: groupedBalances,
      balancesByAddress: groupedBalancesByAddress,
      metadata,
      isEmpty,
    }),
    [rawData, groupedBalances, groupedBalancesByAddress, metadata, isEmpty],
  );
};
