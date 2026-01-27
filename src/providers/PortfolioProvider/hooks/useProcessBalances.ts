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
import { type PositionBalance } from '../types';

export const useProcessBalances = (lpTokens: PositionBalance[]) => {
  const rawData = useBalancesData();

  const balances = useMemo(
    () => toWalletPortfolioBalances(rawData.balances),
    [rawData.balances],
  );

  const balancesByAddress = useMemo(() => {
    return mapValues(rawData.balancesByAddress, toWalletPortfolioBalances);
  }, [rawData.balancesByAddress]);

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

  return {
    ...rawData,
    balances: groupedBalances,
    balancesByAddress: groupedBalancesByAddress,
    metadata,
    isEmpty: dedupedBalances.length === 0,
  };
};
