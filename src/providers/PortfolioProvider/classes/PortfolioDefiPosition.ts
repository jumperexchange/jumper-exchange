import type { DefiPosition } from '@/types/jumper-backend';
import type { PortfolioFormatters } from '../hooks/usePortfolioFormatters';
import type { PortfolioExtendedToken } from './PortfolioExtendedToken';

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
