'use client';

import {
  ChainType,
  getChains,
  getWalletBalances,
  getTokens as LifiGetTokens,
} from '@lifi/sdk';
import type { Account } from '@lifi/wallet-management';
import { fetchAllTokensBalanceByChain } from '@/utils/getTokens/fetchAllTokensBalanceByChain';
import { transformWalletBalances } from '@/utils/getTokens/transformWalletBalances';
import { sumBy } from 'lodash';
import type { PortfolioToken } from '@/types/tokens';

interface Events {
  onProgress: (
    account: string,
    round: number,
    cumulativePriceUSD: number,
    fetchedBalances: PortfolioToken[],
  ) => void;
}

async function getTokens(
  account: Pick<Account, 'chainType' | 'address'>,
  events: Events,
): Promise<PortfolioToken[] | undefined> {
  try {
    const chains = await getChains({
      chainTypes: [account.chainType],
    });

    if (account.chainType === ChainType.EVM && account.address) {
      const walletBalances = await getWalletBalances(account.address);
      const transformed = transformWalletBalances(walletBalances, chains);

      const cumulativePriceUSD = sumBy(transformed, 'totalPriceUSD');

      events.onProgress(account.address, 1, cumulativePriceUSD, transformed);

      return transformed;
    }

    const { tokens } = await LifiGetTokens({
      chainTypes: [account.chainType],
    });

    return new Promise((resolve, reject) => {
      try {
        fetchAllTokensBalanceByChain(
          account.address!,
          chains,
          tokens,
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
