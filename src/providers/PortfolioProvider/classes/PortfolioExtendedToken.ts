import type { Token } from '@lifi/sdk';
import type { ExtendedChain } from '@lifi/sdk';
import { ExtendedToken } from '@/utils/Token';
import type { LiFiCommonToken } from '../lib/fetchTokensForAddresses';
import type { Token as JumperToken, DefiToken } from '@/types/jumper-backend';
import type { PortfolioFormatters } from '../hooks/usePortfolioFormatters';
import { formatTokenAmount } from '@/utils/format';

interface PortfolioTokenData {
  amount: number;
  amountUSD: number;
  chainKey: string;
}

export type PriceLookup = (
  chainId: number,
  address: string,
) => number | undefined;

export class PortfolioExtendedToken extends ExtendedToken {
  amount: number;
  amountUSD: number;
  chainKey: string;

  private static formatters?: PortfolioFormatters;

  static setFormatters(formatters: PortfolioFormatters): void {
    PortfolioExtendedToken.formatters = formatters;
  }

  private constructor(baseToken: Token, data: PortfolioTokenData) {
    super(baseToken);
    this.amount = data.amount;
    this.amountUSD = data.amountUSD;
    this.chainKey = data.chainKey;
  }

  displayAmountUSD(options?: { compact?: boolean }): string {
    if (PortfolioExtendedToken.formatters) {
      return PortfolioExtendedToken.formatters.amountUSD(
        this.amountUSD,
        options,
      );
    }
    return super.formatAmountUSD(this.amount);
  }

  displayAmount(): string {
    if (PortfolioExtendedToken.formatters) {
      return PortfolioExtendedToken.formatters.amount(this.amount, this.symbol);
    }
    return super.formatAmount(this.amount);
  }

  static formatUnitsToNumber(
    amount: string | number | bigint,
    decimals: number,
  ): number {
    try {
      return parseFloat(formatTokenAmount(BigInt(amount), decimals));
    } catch (error) {
      console.error(error);
      return Number(amount);
    }
  }

  static fromLiFiToken(
    token: LiFiCommonToken,
    chain: ExtendedChain,
    getPrice?: PriceLookup,
  ): PortfolioExtendedToken {
    const amount = this.formatUnitsToNumber(token.amount, token.decimals) || 0;
    const freshPrice = getPrice?.(token.chainId, token.address);
    const priceUSD = freshPrice || parseFloat(token.priceUSD) || 0;
    const amountUSD = amount * priceUSD;

    const baseToken: Token = {
      chainId: token.chainId,
      address: token.address,
      symbol: token.symbol,
      decimals: token.decimals,
      name: token.name,
      logoURI: token.logoURI,
      priceUSD: priceUSD.toString(),
    };

    return new PortfolioExtendedToken(baseToken, {
      amount,
      amountUSD,
      chainKey: chain.key,
    });
  }

  static fromJumperToken(
    token: JumperToken & { amount?: string },
    getPrice?: PriceLookup,
  ): PortfolioExtendedToken {
    const amount = 0;
    const freshPrice = getPrice?.(token.chain.chainId, token.address);
    const priceUSD = freshPrice || 0;
    const amountUSD = amount * priceUSD;
    return new PortfolioExtendedToken(
      {
        chainId: token.chain.chainId,
        address: token.address,
        symbol: token.symbol,
        decimals: token.decimals,
        name: token.name,
        logoURI: token.logo,
        priceUSD: priceUSD.toString(),
      },
      {
        amount,
        amountUSD,
        chainKey: token.chain.chainKey,
      },
    );
  }

  static fromDefiToken(
    token: DefiToken,
    getPrice?: PriceLookup,
  ): PortfolioExtendedToken {
    const amount = parseFloat(token.amount) || 0;
    const freshPrice = getPrice?.(token.chain.chainId, token.address);
    const priceUSD = freshPrice || token.priceUSD || 0;
    const amountUSD = amount * priceUSD;

    const baseToken: Token = {
      chainId: token.chain.chainId,
      address: token.address,
      symbol: token.symbol,
      decimals: token.decimals,
      name: token.name,
      logoURI: token.logo,
      priceUSD: priceUSD.toString(),
    };

    return new PortfolioExtendedToken(baseToken, {
      amount,
      amountUSD,
      chainKey: token.chain.chainKey,
    });
  }
}
