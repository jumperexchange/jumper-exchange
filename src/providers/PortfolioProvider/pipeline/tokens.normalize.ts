import type { ExtendedChain } from '@lifi/sdk';
import type { LiFiCommonToken } from '../lib/fetchTokensForAddresses';
import {
  PortfolioExtendedToken,
  type PriceLookup,
} from '../classes/PortfolioExtendedToken';

export interface NormalizeTokensParams {
  tokens: LiFiCommonToken[];
  chains: ExtendedChain[];
  getPrice: PriceLookup;
}

export const normalizeTokens = ({
  tokens,
  chains,
  getPrice,
}: NormalizeTokensParams): PortfolioExtendedToken[] => {
  return tokens
    .map((token) => {
      try {
        const chain = chains.find((c) => c.id === token.chainId);
        if (!chain) {
          return null;
        }
        return PortfolioExtendedToken.fromLiFiToken(token, chain, getPrice);
      } catch (error) {
        console.warn(
          `[normalizeTokens] Failed to normalize token ${token.symbol} on chain ${token.chainId}:`,
          error,
        );
        return null;
      }
    })
    .filter(Boolean) as PortfolioExtendedToken[];
};
