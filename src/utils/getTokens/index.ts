import type { TokenAmount } from '@lifi/sdk';
import { getChains, getTokens as LifiGetTokens } from '@lifi/sdk';
import type { Account } from '@lifi/wallet-management';
import { fetchAllTokensBalanceByChain } from '@/utils/getTokens/fetchAllTokensBalanceByChain';

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
    const chains = await getChains({
      chainTypes: [account.chainType],
    });
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
