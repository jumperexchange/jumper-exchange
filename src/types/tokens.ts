import type {
  CoinKey,
  Token as LifiToken,
  StaticToken,
  TokenExtended,
  TokenTag,
} from '@lifi/sdk';

import type {
  App,
  AppToken,
  Chain,
  DefiToken,
  Token as JumperToken,
} from '@/types/jumper-backend';
import { safeBigInt } from '@/utils/numbers/safeBigInt';
import { formatUnits } from 'viem';

/** @deprecated Will be replaced by WalletPortfolioBalance from PortfolioProvider. */
export interface PortfolioToken extends JumperToken {
  balance: number;
  totalPriceUSD: number;
  relatedTokens?: Omit<PortfolioToken, 'relatedTokens'>[];
}

/** @deprecated Will be replaced after migration to PortfolioProvider. */
export interface PortfolioTokenWithRelated extends PortfolioToken {
  relatedTokens: PortfolioToken[];
}

export interface CoreToken {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
}

export interface BaseToken extends CoreToken {
  type: 'base' | 'extended' | 'position' | 'wallet';
  chainId: number;
  coinKey?: CoinKey;
  tags?: TokenTag[];
}

export interface PricedToken extends BaseToken {
  type: 'extended' | 'position' | 'wallet';
  priceUSD: string;
}

export interface ExtendedToken extends PricedToken {
  type: 'extended';
}

export interface WalletToken extends PricedToken {
  type: 'wallet';
  chainKey: string;
}

export interface PositionToken extends PricedToken {
  type: 'position';
  chain?: Chain;
  app?: App;
}

export interface Balance<T extends PricedToken = ExtendedToken> {
  amount: bigint;
  token: T;
}

export interface PortfolioBalance<
  T extends PricedToken = ExtendedToken,
> extends Balance<T> {
  amountUSD: number;
}

export type Token = BaseToken | ExtendedToken | PositionToken | WalletToken;

export type TokenBalance = Balance<ExtendedToken>;

export interface PortfolioTokenChain {
  chainId: number;
  chainKey: string;
}

export const isExtendedToken = (token: BaseToken): token is ExtendedToken => {
  return token.type === 'extended';
};

export const isPositionToken = (token: BaseToken): token is PositionToken => {
  return token.type === 'position';
};

export const isWalletToken = (token: BaseToken): token is WalletToken => {
  return token.type === 'wallet';
};

const isJumperToken = (
  token: StaticToken | JumperToken,
): token is JumperToken => {
  return 'chain' in token;
};

const isDefiToken = (
  token: ExtendedToken | DefiToken | AppToken,
): token is DefiToken => {
  return (
    typeof token === 'object' &&
    token !== null &&
    !('type' in token) &&
    'chain' in token &&
    'chainType' in token
  );
};

const isAppToken = (
  token: ExtendedToken | DefiToken | AppToken,
): token is AppToken => {
  return (
    typeof token === 'object' &&
    token !== null &&
    !('type' in token) &&
    'app' in token &&
    !('chain' in token)
  );
};

export const hasMarketData = (
  token: LifiToken | TokenExtended,
): token is TokenExtended => {
  return 'marketCapUSD' in token;
};

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

export const createExtendedToken = (
  token: StaticToken | JumperToken | LifiToken,
  priceUSD?: string | undefined,
): ExtendedToken => {
  const baseToken = createBaseToken(token);
  const effectivePriceUSD = 'priceUSD' in token ? token.priceUSD : priceUSD;
  if (effectivePriceUSD === undefined) {
    throw new Error('Price USD is required');
  }
  return {
    ...baseToken,
    priceUSD: effectivePriceUSD,
    type: 'extended',
  };
};

export const createWalletToken = (
  token: LifiToken & { chainKey: string },
): WalletToken => {
  return {
    ...createExtendedToken(token),
    type: 'wallet',
    chainKey: token.chainKey,
  };
};

export const createPositionToken = (
  token: DefiToken | AppToken,
): PositionToken => {
  if (isDefiToken(token)) {
    return {
      type: 'position',
      address: token.address,
      name: token.name,
      symbol: token.symbol,
      decimals: token.decimals,
      logoURI: token.logo,
      priceUSD: String(token.priceUSD),
      chainId: token.chain.chainId,
      chain: token.chain,
    };
  }

  return {
    type: 'position',
    address: token.address,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    logoURI: token.logo,
    priceUSD: String(token.priceUSD),
    chainId: -1, // App tokens don't have a chainId
    app: token.app,
  };
};

export function createTokenBalance(
  token: ExtendedToken,
  amount: bigint | string,
): TokenBalance;
export function createTokenBalance(
  token: DefiToken,
  amount?: never,
): TokenBalance;
export function createTokenBalance(
  token: ExtendedToken | DefiToken,
  amount?: bigint | string,
): TokenBalance {
  if (isDefiToken(token)) {
    return {
      amount: safeBigInt(token.amount),
      token: createExtendedToken(token),
    };
  }
  if (amount === undefined) {
    throw new Error('Amount is required for ExtendedToken');
  }
  return {
    amount: safeBigInt(amount),
    token,
  };
}

export const createPositionBalance = (
  token: DefiToken | AppToken,
  freshPriceUSD?: number,
): PortfolioBalance<PositionToken> => {
  const amount = safeBigInt(token.amount);
  const priceUSD = freshPriceUSD ?? token.priceUSD;
  const amountNum = Number(formatUnits(amount, token.decimals));

  return {
    amount,
    amountUSD: amountNum * priceUSD,
    token: createPositionToken(token),
  };
};
