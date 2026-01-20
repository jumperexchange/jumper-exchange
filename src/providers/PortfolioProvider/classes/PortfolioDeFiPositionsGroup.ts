import { orderBy, sumBy } from 'lodash';
import type { PortfolioDefiPosition } from '../types/positions.types';
import type { PortfolioFormatters } from '../hooks/usePortfolioFormattersInternal';

export class PortfolioDeFiPositionsGroup {
  main: PortfolioDefiPosition;
  all: PortfolioDefiPosition[];
  amountUSD: number;
  percentageOfAmountUSD?: number;

  private static formatters?: PortfolioFormatters;

  static setFormatters(formatters: PortfolioFormatters): void {
    PortfolioDeFiPositionsGroup.formatters = formatters;
  }

  constructor(
    positions: PortfolioDefiPosition[],
    totalPositionsValueUSD: number,
  ) {
    if (positions.length === 0) {
      throw new Error(
        'PortfolioDeFiPositionsGroup requires at least one position',
      );
    }

    const sorted = orderBy(positions, (p) => p.netUsd, 'desc');
    this.main = sorted[0];
    this.all = sorted;
    this.amountUSD = sumBy(sorted, (p) => p.netUsd);
    this.percentageOfAmountUSD =
      totalPositionsValueUSD > 0
        ? (this.amountUSD / totalPositionsValueUSD) * 100
        : 0;
  }

  displayAmountUSD(): string {
    if (PortfolioDeFiPositionsGroup.formatters) {
      return PortfolioDeFiPositionsGroup.formatters.amountUSD(this.amountUSD);
    }
    return `$${this.amountUSD.toFixed(2)}`;
  }

  displayPercentageOfAmountUSD(): string {
    if (PortfolioDeFiPositionsGroup.formatters && this.percentageOfAmountUSD) {
      return PortfolioDeFiPositionsGroup.formatters.percentage(
        this.percentageOfAmountUSD,
      );
    }
    return `${(this.percentageOfAmountUSD ?? 0).toFixed(2)}%`;
  }

  hasMultiplePositions(): boolean {
    return this.all.length > 1;
  }
}
