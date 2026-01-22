import type {
  ChainId,
  CoinKey,
  StaticToken,
  Token,
  TokenExtended,
  TokenTag,
} from '@lifi/sdk';
import {
  formatTokenAmount,
  formatTokenPrice,
  priceToTokenAmount,
} from '@lifi/widget';

import type { Token as JumperToken } from '@/types/jumper-backend';
import { formatUSD } from './formatNumbers';

const isJumperToken = (
  token: StaticToken | JumperToken,
): token is JumperToken => {
  return 'chain' in token;
};

const hasMarketData = (
  token: Token | TokenExtended,
): token is TokenExtended => {
  return 'marketCapUSD' in token;
};

// TODO: Think whether it might make more sense to use t('format.decimal', { value: token.balance }), somehow
export class SimpleToken {
  chainId: ChainId;
  address: string;
  symbol: string;
  decimals: number;
  name: string;
  coinKey?: CoinKey;
  logoURI?: string;
  tags?: TokenTag[];

  constructor(token: StaticToken | JumperToken) {
    this.address = token.address;
    this.symbol = token.symbol;
    this.name = token.name;
    this.decimals = token.decimals;

    if (isJumperToken(token)) {
      this.chainId = token.chain.chainId;
      this.logoURI = token.logo;
    } else {
      this.chainId = token.chainId;
      this.logoURI = token.logoURI;
      this.coinKey = token.coinKey;
      this.tags = token.tags;
    }
  }

  protected formatTokenWithSymbol(amount: string) {
    return `${amount} ${this.symbol || '---'}`;
  }

  formatAmount(amount: string | number | bigint) {
    if (typeof amount == 'number' && !Number.isInteger(amount)) {
      console.error(`Token formatAmount: number ${amount} is not an integer`);
    }
    return this.formatTokenWithSymbol(
      formatTokenAmount(BigInt(amount), this.decimals),
    );
  }

  // Like formatAmount, but using 0 as the amount. Helper function to get a consistent formatting
  formatZeroAmount() {
    return this.formatAmount(0);
  }

  // Like formatAmountUSD, but using 0 as the amount. Helper function to get a consistent formatting
  formatZeroUSD() {
    return formatUSD(0);
  }
}

export class ExtendedToken extends SimpleToken {
  priceUSD: string;
  marketCapUSD?: number | null;
  volumeUSD24H?: number | null;
  fdvUSD?: number | null;

  constructor(token: Token | TokenExtended) {
    super(token);
    this.priceUSD = token.priceUSD;
    if (hasMarketData(token)) {
      this.marketCapUSD = token.marketCapUSD;
      this.volumeUSD24H = token.volumeUSD24H;
      this.fdvUSD = token.fdvUSD;
    }
  }

  hasPriceUSD() {
    return parseFloat(this.priceUSD) > 0;
  }

  formatPriceUSD() {
    if (!this.priceUSD) {
      console.error(
        `Token formatPriceUSD: Could not find price for token with address ${this.address}`,
      );
      return undefined;
    }

    return formatUSD(this.priceUSD);
  }

  formatAmountUSD(amountToken: string | number | bigint): string {
    if (typeof amountToken == 'number' && !Number.isInteger(amountToken)) {
      console.error(
        `Token formatAmountUSD: number ${amountToken} is not an integer`,
      );
    }

    const amount = this.priceUSD
      ? formatTokenPrice(
          formatTokenAmount(BigInt(amountToken), this.decimals),
          this.priceUSD,
        )
      : 0;
    return formatUSD(amount);
  }

  formatAmountFromUSD(amountUSD: string | number | bigint) {
    const amount = this.priceUSD
      ? priceToTokenAmount(amountUSD.toString(), this.priceUSD)
      : '0';
    return this.formatTokenWithSymbol(amount);
  }
}
