'use client';

import type { TokenAmount } from '@lifi/sdk';
import {
  ChainType,
  getChains,
  getWalletBalances,
  getTokens as LifiGetTokens,
} from '@lifi/sdk';
import type { Account } from '@lifi/wallet-management';
import { fetchAllTokensBalanceByChain } from '@/utils/getTokens/fetchAllTokensBalanceByChain';
import { transformWalletBalances } from '@/utils/getTokens/transformWalletBalances';
import {
  mergeTokenBalances,
  filterExcludedTokens,
  deduplicateWalletBalances,
} from '@/utils/getTokens/utils';
import { sumBy, some } from 'lodash';

export interface ExtendedTokenAmountWithChain extends ExtendedTokenAmount {
  chainLogoURI?: string;
  chainName?: string;
}

interface Price {
  amount?: bigint;
  totalPriceUSD: number;
  formattedBalance: number;
}

export interface ExtendedTokenAmount extends TokenAmount, Partial<Price> {
  chains: ExtendedTokenAmountWithChain[];
  cumulatedBalance?: number; // Cumulated balance across chains
  cumulatedTotalUSD?: number; // Cumulated total USD across chains
}

interface Events {
  onProgress: (
    account: string,
    round: number,
    cumulativePriceUSD: number,
    fetchedBalances: ExtendedTokenAmount[],
  ) => void;
}

async function getTokens(
  account: Pick<Account, 'chainType' | 'address'>,
  events: Events,
): Promise<undefined | ExtendedTokenAmountWithChain[]> {
  try {
    const isEVM = account.chainType === ChainType.EVM && account.address;

    const [chains, { tokens: allTokens }, walletBalances] = await Promise.all([
      getChains({ chainTypes: [account.chainType] }),
      LifiGetTokens({ chainTypes: [account.chainType] }),
      isEVM ? getWalletBalances(account.address!) : Promise.resolve(null),
    ]);

    if (isEVM && walletBalances) {
      const uniqueWalletBalances = deduplicateWalletBalances(walletBalances);
      const transformed = transformWalletBalances(uniqueWalletBalances, chains);
      const cumulativePriceUSD = sumBy(transformed, 'totalPriceUSD');

      events.onProgress(account.address!, 1, cumulativePriceUSD, transformed);

      const remainingTokens = filterExcludedTokens(
        allTokens,
        uniqueWalletBalances,
      );
      const hasRemainingTokens = some(
        remainingTokens,
        (tokens) => tokens.length > 0,
      );

      if (!hasRemainingTokens) {
        return transformed;
      }

      return new Promise((resolve) => {
        fetchAllTokensBalanceByChain(
          account.address!,
          chains,
          remainingTokens,
          (addr, round, additionalPriceUSD, additionalBalances) => {
            const merged = mergeTokenBalances(transformed, additionalBalances);
            const totalPriceUSD = sumBy(merged, 'cumulatedTotalUSD');
            events.onProgress(addr, round + 1, totalPriceUSD, merged);
          },
          (additionalBalances) => {
            const merged = mergeTokenBalances(transformed, additionalBalances);
            resolve(merged);
          },
        );
      });
    }

    return new Promise((resolve, reject) => {
      try {
        fetchAllTokensBalanceByChain(
          account.address!,
          chains,
          allTokens,
          events.onProgress,
          (combinedBalance) => {
            resolve(combinedBalance);
          },
        );
      } catch (error) {
        reject(error);
      }
    });
  } catch (error) {
    console.error('An error occurred during the fetching process:', error);
  }
}

export default getTokens;
