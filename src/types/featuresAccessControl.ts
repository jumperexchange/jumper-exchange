export enum FeaturesAccessControlFeature {
  Deposit = 'Deposit',
  Withdraw = 'Withdraw',
  RewardClaim = 'RewardClaim',
  RewardCompound = 'RewardCompound',
  Repay = 'Repay',
  Borrow = 'Borrow',
}

export enum FeaturesAccessControlGranularity {
  Global = 'Global',
  Targeted = 'Targeted',
}

export interface FeaturesAccessControlData {
  id: number;
  documentId: string;
  Feature: FeaturesAccessControlFeature;
  Granularity: FeaturesAccessControlGranularity;
  disabledEarnOpportunities: { Slug: string }[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}
