import type { PortfolioFormatters } from '../hooks/usePortfolioFormatters';
import { computePercentage } from '../utils/summary';
import type { PortfolioTokenGroup } from './tokens';
import type { PortfolioDeFiPositionsGroup } from './positions';

export class PortfolioSummary {
  totalAmountUSD: number;
  tokensAmountUSD: number;
  positionsAmountUSD: number;
  tokensBySymbol: PortfolioTokenGroup[];
  positionsByProtocol: PortfolioDeFiPositionsGroup[];

  private static formatters?: PortfolioFormatters;

  static setFormatters(formatters: PortfolioFormatters): void {
    PortfolioSummary.formatters = formatters;
  }

  constructor(
    totalAmountUSD: number,
    tokensAmountUSD: number,
    positionsAmountUSD: number,
    tokensBySymbol: PortfolioTokenGroup[],
    positionsByProtocol: PortfolioDeFiPositionsGroup[],
  ) {
    this.totalAmountUSD = totalAmountUSD;
    this.tokensAmountUSD = tokensAmountUSD;
    this.positionsAmountUSD = positionsAmountUSD;
    this.tokensBySymbol = tokensBySymbol;
    this.positionsByProtocol = positionsByProtocol;
  }

  displayTotalAmountUSD(options?: { compact?: boolean }): string {
    if (PortfolioSummary.formatters) {
      return PortfolioSummary.formatters.amountUSD(
        this.totalAmountUSD,
        options,
      );
    }
    return `$${this.totalAmountUSD.toFixed(2)}`;
  }

  displayTokensAmountUSD(options?: { compact?: boolean }): string {
    if (PortfolioSummary.formatters) {
      return PortfolioSummary.formatters.amountUSD(
        this.tokensAmountUSD,
        options,
      );
    }
    return `$${this.tokensAmountUSD.toFixed(2)}`;
  }

  displayPositionsAmountUSD(options?: { compact?: boolean }): string {
    if (PortfolioSummary.formatters) {
      return PortfolioSummary.formatters.amountUSD(
        this.positionsAmountUSD,
        options,
      );
    }
    return `$${this.positionsAmountUSD.toFixed(2)}`;
  }

  get tokensPercentage(): number {
    return computePercentage(this.tokensAmountUSD, this.totalAmountUSD);
  }

  get positionsPercentage(): number {
    return computePercentage(this.positionsAmountUSD, this.totalAmountUSD);
  }

  displayTokensPercentage(): string {
    if (PortfolioSummary.formatters) {
      return PortfolioSummary.formatters.percentage(this.tokensPercentage);
    }
    return `${this.tokensPercentage.toFixed(2)}%`;
  }

  displayPositionsPercentage(): string {
    if (PortfolioSummary.formatters) {
      return PortfolioSummary.formatters.percentage(this.positionsPercentage);
    }
    return `${this.positionsPercentage.toFixed(2)}%`;
  }
}
