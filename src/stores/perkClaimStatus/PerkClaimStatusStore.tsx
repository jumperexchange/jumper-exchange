import { createWithEqualityFn } from 'zustand/traditional';

export enum PerkClaimStatus {
  Idle = 'idle',
  Pending = 'pending',
  Success = 'success',
  Error = 'error',
}

interface PerkClaimStatusState {
  statusMap: Record<string, PerkClaimStatus>;
  setStatus: (
    perkId: string,
    walletAddress: string,
    status: PerkClaimStatus,
  ) => void;
  getStatus: (perkId: string, walletAddress: string) => PerkClaimStatus;
  resetStatus: (perkId: string, walletAddress: string) => void;
  resetAllStatuses: () => void;
}

const getKey = (perkId: string, walletAddress: string): string =>
  `${perkId}-${walletAddress}`;

export const usePerkClaimStatusStore =
  createWithEqualityFn<PerkClaimStatusState>(
    (set, get) => ({
      statusMap: {},

      setStatus: (perkId, walletAddress, status) => {
        set((state) => ({
          statusMap: {
            ...state.statusMap,
            [getKey(perkId, walletAddress)]: status,
          },
        }));
      },

      getStatus: (perkId, walletAddress) => {
        return (
          get().statusMap[getKey(perkId, walletAddress)] || PerkClaimStatus.Idle
        );
      },

      resetStatus: (perkId, walletAddress) => {
        set((state) => {
          const { [getKey(perkId, walletAddress)]: _, ...rest } =
            state.statusMap;
          return { statusMap: rest };
        });
      },

      resetAllStatuses: () => {
        set({ statusMap: {} });
      },
    }),
    Object.is,
  );
