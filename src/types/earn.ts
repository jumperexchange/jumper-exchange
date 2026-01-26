import type { EarnInteractionFlags } from './jumper-backend';

export enum EarnInteractionFeature {
  Deposit = 'Deposit',
  Withdraw = 'Withdraw',
  RewardClaim = 'RewardClaim',
  RewardCompound = 'RewardCompound',
  Repay = 'Repay',
  Borrow = 'Borrow',
}

export const EARN_INTERACTION_KEY_MAP: Record<
  EarnInteractionFeature,
  keyof EarnInteractionFlags
> = {
  [EarnInteractionFeature.Deposit]: 'canDeposit',
  [EarnInteractionFeature.Withdraw]: 'canWithdraw',
  [EarnInteractionFeature.RewardClaim]: 'canRewardClaim',
  [EarnInteractionFeature.RewardCompound]: 'canRewardCompound',
  [EarnInteractionFeature.Repay]: 'canRepay',
  [EarnInteractionFeature.Borrow]: 'canBorrow',
};
