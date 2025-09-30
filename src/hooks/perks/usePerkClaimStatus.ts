import {
  usePerkClaimStatusStore,
  PerkClaimStatus,
} from 'src/stores/perkClaimStatus';

/**
 * Hook to get the claim status for a specific perk
 */
export const usePerkClaimStatus = (perkId: string) => {
  const { getStatus, setStatus, resetStatus } = usePerkClaimStatusStore();

  return {
    status: getStatus(perkId),
    isIdle: getStatus(perkId) === PerkClaimStatus.Idle,
    isPending: getStatus(perkId) === PerkClaimStatus.Pending,
    isSuccess: getStatus(perkId) === PerkClaimStatus.Success,
    isError: getStatus(perkId) === PerkClaimStatus.Error,
    setStatus: (status: PerkClaimStatus) => setStatus(perkId, status),
    resetStatus: () => resetStatus(perkId),
  };
};
