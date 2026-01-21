import { orderBy, sumBy } from 'lodash';
import type { PortfolioExtendedToken } from './PortfolioExtendedToken';
import type { PortfolioFormatters } from '../hooks/usePortfolioFormatters';
import { computePercentage } from '../utils/computePercentage';

export class PortfolioTokenGroup {
  main: PortfolioExtendedToken;
  all: PortfolioExtendedToken[];
  amountUSD: number;
  amount: number;
  percentageOfAmountUSD?: number;

  private static formatters?: PortfolioFormatters;

  static setFormatters(formatters: PortfolioFormatters): void {
    PortfolioTokenGroup.formatters = formatters;
  }

  constructor(tokens: PortfolioExtendedToken[], totalTokensValueUSD: number) {
    if (tokens.length === 0) {
      throw new Error('PortfolioTokenGroup requires at least one token');
    }

    const sorted = orderBy(tokens, (t) => t.amountUSD, 'desc');
    this.main = sorted[0];
    this.all = sorted;
    this.amountUSD = sumBy(sorted, (t) => t.amountUSD);
    this.amount = sumBy(sorted, (t) => t.amount);
    this.percentageOfAmountUSD = computePercentage(
      this.amountUSD,
      totalTokensValueUSD,
    );
  }

  displayAmountUSD(): string {
    if (PortfolioTokenGroup.formatters) {
      return PortfolioTokenGroup.formatters.amountUSD(this.amountUSD);
    }
    return `$${this.amountUSD.toFixed(2)}`;
  }

  displayAmount(): string {
    if (PortfolioTokenGroup.formatters) {
      return PortfolioTokenGroup.formatters.amount(
        this.amount,
        this.main.symbol,
      );
    }
    return `${this.amount} ${this.main.symbol}`;
  }

  displayPercentageOfAmountUSD(): string {
    if (PortfolioTokenGroup.formatters && this.percentageOfAmountUSD) {
      return PortfolioTokenGroup.formatters.percentage(
        this.percentageOfAmountUSD,
      );
    }
    return `${(this.percentageOfAmountUSD ?? 0).toFixed(2)}%`;
  }

  hasMultipleChains(): boolean {
    return this.all.length > 1;
  }
}
