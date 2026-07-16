import { useMutation } from '@tanstack/react-query';
import {
  PerkClaimStatus,
  usePerkClaimStatusStore,
} from 'src/stores/perkClaimStatus';
import type { PerkClaimDto } from 'src/types/jumper-backend';
import { makeClient } from '@/app/lib/client';
import { useGetClaimedPerks } from './useGetClaimedPerks';

export async function claimPerkQuery(props: PerkClaimDto) {
  const client = makeClient();
  const response = await client.v1.perksControllerPerkClaimV1(props);
  if (!response.data) {
    throw new Error('Invalid response');
  }

  return response.data.data;
}

export const useClaimPerk = (address?: string, perkId?: string) => {
  const { setStatus } = usePerkClaimStatusStore();
  const { refetch } = useGetClaimedPerks(address);

  return useMutation({
    mutationKey: ['perks', 'claim', address, perkId],
    mutationFn: (props: PerkClaimDto) => {
      return claimPerkQuery(props);
    },
    onMutate: () => {
      if (perkId && address) {
        setStatus(perkId, address, PerkClaimStatus.Pending);
      }
    },
    onSuccess: () => {
      if (perkId && address) {
        setStatus(perkId, address, PerkClaimStatus.Success);
      }
      if (address) {
        refetch();
      }
    },
    onError: () => {
      if (perkId && address) {
        setStatus(perkId, address, PerkClaimStatus.Error);
      }
    },
  });
};
