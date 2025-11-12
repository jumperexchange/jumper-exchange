import { EarnOpportunityWithLatestAnalytics } from './jumper-backend';

export interface EarnOpportunityRewardEntity
  extends Pick<EarnOpportunityWithLatestAnalytics, 'asset'> {
  balance: number;
  totalPriceUSD: number;
}

export interface MinimalDeFiPosition
  extends Omit<EarnOpportunityWithLatestAnalytics, 'rewards'> {
  performance?: number;
  openedAt?: string;
  balance: number;
  totalPriceUSD: number;
  relatedPositions?: Omit<MinimalDeFiPosition, 'relatedPositions'>[];
  rewards?: EarnOpportunityRewardEntity[];
}
