import type { Token } from 'src/types/jumper-backend';
import type { PortfolioToken } from 'src/types/tokens';
import type { TokenStackToken } from './types';

type SupportedToken = Token | PortfolioToken;

export function toTokenStackToken(token: Token): TokenStackToken;
export function toTokenStackToken(token: PortfolioToken): TokenStackToken;
export function toTokenStackToken(token: SupportedToken): TokenStackToken {
  return {
    address: token.address,
    logoURI: token.logo,
    name: token.name,
    symbol: token.symbol,
    chain: token.chain,
  };
}

export function toTokenStackTokens(tokens: Token[]): TokenStackToken[];
export function toTokenStackTokens(tokens: PortfolioToken[]): TokenStackToken[];
export function toTokenStackTokens(
  tokens: SupportedToken[],
): TokenStackToken[] {
  return tokens.map((token) => toTokenStackToken(token as Token));
}
