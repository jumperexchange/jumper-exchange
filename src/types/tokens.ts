import type {
  CoinKey,
  Token as LifiToken,
  StaticToken,
  TokenExtended,
  TokenTag,
} from '@lifi/sdk';

import type { Token as JumperToken } from '@/types/jumper-backend';

const isJumperToken = (
  token: StaticToken | JumperToken,
): token is JumperToken => {
  return 'chain' in token;
};

export interface BaseToken {
  type: 'base' | 'extended';
  chainId: number;
  address: string;
  symbol: string;
  decimals: number;
  name: string;
  logoURI?: string;
  coinKey?: CoinKey;
  tags?: TokenTag[];
}

export const createBaseToken = (
  token: StaticToken | JumperToken,
): BaseToken => {
  const base = {
    address: token.address,
    symbol: token.symbol,
    name: token.name,
    decimals: token.decimals,
  };

  let result: BaseToken;

  if (isJumperToken(token)) {
    result = {
      ...base,
      type: 'base',
      chainId: token.chain.chainId,
      logoURI: token.logo,
    };
  } else {
    result = {
      ...base,
      type: 'base',
      chainId: token.chainId,
      logoURI: token.logoURI,
      coinKey: token.coinKey,
      tags: token.tags,
    };
  }
  return result;
};

export type Token = BaseToken | ExtendedToken;

export interface ExtendedToken extends BaseToken {
  type: 'extended';
  priceUSD: string;
}

export interface TokenBalance {
  amount: bigint;
  token: Token;
}

export const isExtendedToken = (token: Token): token is ExtendedToken => {
  return token.type === 'extended';
};

// FIXME: Let's see if we need this
export const hasMarketData = (
  token: LifiToken | TokenExtended,
): token is TokenExtended => {
  return 'marketCapUSD' in token;
};

// export interface PortfolioBalance {
//   relatedBalances: Omit<PortfolioBalance, 'relatedBalances'>[];
// }

// export const isPortfolioToken = (token: Token): token is PortfolioToken => {
//   return token.type === 'portfolio';
// };
//
// FIXME: adjust these types?

// // @Note: This might change after we decide on the backend API types for the portfolio token; then we can reuse also for the wallet menu
// export interface PortfolioToken extends LifiToken {
//   balance: number;
//   totalPriceUSD: number;
//   relatedTokens?: Omit<PortfolioToken, 'relatedTokens'>[];
// }
//
// export type PortfolioTokenWithRelated = PortfolioToken & {
//   relatedTokens: Omit<PortfolioToken, 'relatedTokens'>[];
// };
