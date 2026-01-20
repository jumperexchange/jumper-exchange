import type { ExtendedChain } from '@lifi/sdk';
import type { LiFiCommonToken } from '../datasources/tokens.datasource';
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
      const chain = chains.find((c) => c.id === token.chainId);
      if (!chain) {
        return null;
      }
      return PortfolioExtendedToken.fromLiFiToken(token, chain, getPrice);
    })
    .filter(Boolean) as PortfolioExtendedToken[];
};
