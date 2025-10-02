import {
  usePerkClaimStatusStore,
  PerkClaimStatus,
} from 'src/stores/perkClaimStatus';

/**
 * Hook to get the claim status for a specific perk
 */
export const usePerkClaimStatus = (perkId: string, address: string) => {
  const { getStatus, setStatus, resetStatus } = usePerkClaimStatusStore();

  return {
    status: getStatus(perkId, address),
    isIdle: getStatus(perkId, address) === PerkClaimStatus.Idle,
    isPending: getStatus(perkId, address) === PerkClaimStatus.Pending,
    isSuccess: getStatus(perkId, address) === PerkClaimStatus.Success,
    isError: getStatus(perkId, address) === PerkClaimStatus.Error,
    setStatus: (status: PerkClaimStatus) => setStatus(perkId, address, status),
    resetStatus: () => resetStatus(perkId, address),
  };
};
