import { createWithEqualityFn } from 'zustand/traditional';

export enum PerkClaimStatus {
  Idle = 'idle',
  Pending = 'pending',
  Success = 'success',
  Error = 'error',
}

interface PerkClaimStatusState {
  statusMap: Record<string, PerkClaimStatus>;
  setStatus: (perkId: string, status: PerkClaimStatus) => void;
  getStatus: (perkId: string) => PerkClaimStatus;
  resetStatus: (perkId: string) => void;
  resetAllStatuses: () => void;
}

export const usePerkClaimStatusStore =
  createWithEqualityFn<PerkClaimStatusState>(
    (set, get) => ({
      statusMap: {},

      setStatus: (perkId, status) => {
        set((state) => ({
          statusMap: { ...state.statusMap, [perkId]: status },
        }));
      },

      getStatus: (perkId) => {
        return get().statusMap[perkId] || PerkClaimStatus.Idle;
      },

      resetStatus: (perkId) => {
        set((state) => {
          const { [perkId]: _, ...rest } = state.statusMap;
          return { statusMap: rest };
        });
      },

      resetAllStatuses: () => {
        set({ statusMap: {} });
      },
    }),
    Object.is,
  );
