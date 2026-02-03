import type { Hex } from 'viem';
import { persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

export const generatePendingClaimedRewardKey = (
  campaignId: string,
  walletAddress: string,
) => `${campaignId}-${walletAddress}`;

interface RewardsStore {
  pendingClaimedRewards: Record<string, Hex>;
  setPendingClaimedReward: (key: string, txHash: Hex) => void;
  removePendingClaimedReward: (key: string) => void;
  getPendingClaimedReward: (key: string) => Hex | undefined;
}

export const useRewardsStore = createWithEqualityFn(
  persist<RewardsStore>(
    (set, get) => ({
      pendingClaimedRewards: {},
      setPendingClaimedReward: (key: string, txHash: Hex) =>
        set({
          pendingClaimedRewards: {
            ...get().pendingClaimedRewards,
            [key]: txHash,
          },
        }),
      removePendingClaimedReward: (key: string) => {
        const { [key]: _, ...rest } = get().pendingClaimedRewards;
        set({
          pendingClaimedRewards: rest,
        });
      },
      getPendingClaimedReward: (key: string) => {
        return get().pendingClaimedRewards[key];
      },
    }),
    {
      name: 'jumper-rewards',
      version: 1,
    },
  ),
  shallow,
);
