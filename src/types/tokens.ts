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

/**
 * Legacy token type for wallet balance display.
 * Used by: getTokens, PortfolioStore, TokenListCard, WalletBalanceCard, etc.
 *
 * @deprecated Will be replaced by WalletPortfolioBalance from PortfolioProvider.
 */
export interface PortfolioToken extends JumperToken {
  balance: number;
  totalPriceUSD: number;
  relatedTokens?: PortfolioToken[];
}

/**
 * Portfolio token with required relatedTokens array.
 * Used when tokens are grouped by symbol across chains.
 *
 * @deprecated Will be replaced after migration to PortfolioProvider.
 */
export interface PortfolioTokenWithRelated extends PortfolioToken {
  relatedTokens: PortfolioToken[];
}

// ============================================================================
// Core Token - Shared foundation for all token types
// ============================================================================

/**
 * Core token properties shared by all token types.
 */
export interface CoreToken {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
}

// ============================================================================
// Base Display Token - For display with price
// ============================================================================

/**
 * Token interface for display purposes with price.
 * Used by ExtendedToken, PositionToken.
 */
export interface BaseDisplayToken extends CoreToken {
  type: 'base' | 'extended' | 'position';
  priceUSD: string;
}

// ============================================================================
// Extended Token - For LiFi/Widget operations (requires chainId)
// ============================================================================

/**
 * Token with chain context for swap/bridge operations.
 * Requires chainId for on-chain operations.
 */
export interface ExtendedToken extends BaseDisplayToken {
  type: 'extended';
  chainId: number;
  coinKey?: CoinKey;
  tags?: TokenTag[];
}

// ============================================================================
// Portfolio Token - For portfolio display (chainId optional)
// ============================================================================

/**
 * Token for position display that preserves source info.
 * - chainId is optional (AppTokens don't have it)
 * - chain is preserved from DefiToken
 * - app is preserved from AppToken
 */
export interface PositionToken extends BaseDisplayToken {
  type: 'position';
  chainId?: number;
  chain?: Chain;
  app?: App;
}

// ============================================================================
// Generic Balance
// ============================================================================

/**
 * Generic balance that works with any token type.
 */
export interface Balance<T extends BaseDisplayToken = BaseDisplayToken> {
  amount: bigint;
  token: T;
}

/**
 * Balance with computed USD value.
 */
export interface PortfolioBalance<
  T extends BaseDisplayToken = BaseDisplayToken,
> extends Balance<T> {
  amountUSD: number;
}

// ============================================================================
// Base Token - For LiFi SDK tokens (without price)
// ============================================================================

/**
 * Token from LiFi SDK with chain context but without price.
 * Used for raw token data before price lookup.
 */
export interface BaseToken extends CoreToken {
  type: 'base' | 'extended';
  chainId: number;
  coinKey?: CoinKey;
  tags?: TokenTag[];
}

export type Token = BaseToken | ExtendedToken;

/**
 * Balance with ExtendedToken - for wallet balances from LiFi.
 */
export type TokenBalance = Balance<ExtendedToken>;

// ============================================================================
// Legacy Portfolio Token - For old wallet balance display system
// ============================================================================

/**
 * Chain info for legacy wallet portfolio tokens.
 */
export interface PortfolioTokenChain {
  chainId: number;
  chainKey: string;
}

// ============================================================================
// Type Guards
// ============================================================================

export const isExtendedToken = (
  token: BaseDisplayToken,
): token is ExtendedToken => {
  return token.type === 'extended';
};

export const isPositionToken = (
  token: BaseDisplayToken,
): token is PositionToken => {
  return token.type === 'position';
};

const isJumperToken = (
  token: StaticToken | JumperToken,
): token is JumperToken => {
  return 'chain' in token;
};

const isDefiToken = (token: unknown): token is DefiToken => {
  return (
    typeof token === 'object' &&
    token !== null &&
    'chain' in token &&
    'chainType' in token
  );
};

const isAppToken = (token: unknown): token is AppToken => {
  return (
    typeof token === 'object' &&
    token !== null &&
    'app' in token &&
    !('chain' in token)
  );
};

// FIXME: Let's see if we need this
export const hasMarketData = (
  token: LifiToken | TokenExtended,
): token is TokenExtended => {
  return 'marketCapUSD' in token;
};

// ============================================================================
// Token Creators
// ============================================================================

/**
 * @deprecated Use createExtendedToken instead
 */
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

/**
 * Create an ExtendedToken from various source types.
 */
export const createExtendedToken = (
  token: StaticToken | JumperToken | LifiToken | DefiToken,
  priceUSD?: string | undefined,
): ExtendedToken => {
  // Handle DefiToken
  if (isDefiToken(token)) {
    return {
      type: 'extended',
      address: token.address,
      name: token.name,
      symbol: token.symbol,
      decimals: token.decimals,
      logoURI: token.logo,
      chainId: token.chain.chainId,
      priceUSD: String(token.priceUSD),
    };
  }

  const baseToken = createBaseToken(token as StaticToken | JumperToken);
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

/**
 * Create a PositionToken from backend token types.
 * Preserves chain/app info from the source.
 */
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

  // AppToken
  return {
    type: 'position',
    address: token.address,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    logoURI: token.logo,
    priceUSD: String(token.priceUSD),
    app: token.app,
  };
};

// ============================================================================
// Balance Creators
// ============================================================================

/**
 * Create a TokenBalance from ExtendedToken or DefiToken.
 */
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

/**
 * Create a PositionBalance from backend token types.
 * Optionally accepts a fresh price for recalculation.
 */
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
