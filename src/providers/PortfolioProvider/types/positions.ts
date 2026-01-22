import { orderBy, sumBy } from 'lodash';
import type {
  DefiPosition,
  Chain,
  Protocol,
  Token,
} from '@/types/jumper-backend';
import type { PortfolioFormatters } from '../hooks/usePortfolioFormatters';
import { computePercentage } from '../utils/summary';
import type { PortfolioExtendedToken, PriceLookup } from './tokens';

export interface LpTokenIdentifier {
  address: string;
  chainId: number;
}

export type PositionGroupingFn = (position: PortfolioDefiPosition) => string;

export type PositionGroupingKey = 'byProtocol' | 'byProtocolAndChain';

interface PortfolioTokens {
  lpToken?: PortfolioExtendedToken;
  supplyTokens: PortfolioExtendedToken[];
  borrowTokens: PortfolioExtendedToken[];
  assetTokens: PortfolioExtendedToken[];
  collateralTokens: PortfolioExtendedToken[];
  rewardTokens: PortfolioExtendedToken[];
}

type DefiPositionBase = Omit<
  DefiPosition,
  | 'lpToken'
  | 'supplyTokens'
  | 'borrowTokens'
  | 'assetTokens'
  | 'collateralTokens'
  | 'rewardTokens'
>;

export class PortfolioDefiPosition
  implements DefiPositionBase, PortfolioTokens
{
  declare name: string;
  declare assetUsd: number;
  declare debtUsd: number;
  declare netUsd: number;
  declare address: string;
  declare chain: DefiPosition['chain'];
  declare earn?: string;
  declare latest?: DefiPosition['latest'];
  declare unlockAt?: string;
  declare openedAt?: string;
  declare type: string;
  declare protocol: DefiPosition['protocol'];
  declare lpToken?: PortfolioExtendedToken;
  declare supplyTokens: PortfolioExtendedToken[];
  declare borrowTokens: PortfolioExtendedToken[];
  declare assetTokens: PortfolioExtendedToken[];
  declare collateralTokens: PortfolioExtendedToken[];
  declare rewardTokens: PortfolioExtendedToken[];

  private static formatters?: PortfolioFormatters;

  static setFormatters(formatters: PortfolioFormatters): void {
    PortfolioDefiPosition.formatters = formatters;
  }

  constructor(position: DefiPosition, tokens: PortfolioTokens) {
    Object.assign(this, position, tokens);
  }

  displayAmountUSD(amountUSD: number, options?: { compact?: boolean }): string {
    if (PortfolioDefiPosition.formatters) {
      return PortfolioDefiPosition.formatters.amountUSD(amountUSD, options);
    }
    return `$${amountUSD.toFixed(2)}`;
  }

  displayNetUsd(options?: { compact?: boolean }): string {
    return this.displayAmountUSD(this.netUsd, options);
  }

  displayAssetUsd(options?: { compact?: boolean }): string {
    return this.displayAmountUSD(this.assetUsd, options);
  }

  displayDebtUsd(options?: { compact?: boolean }): string {
    return this.displayAmountUSD(this.debtUsd, options);
  }
}

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
    this.percentageOfAmountUSD = computePercentage(
      this.amountUSD,
      totalPositionsValueUSD,
    );
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
