import { useMutation } from '@tanstack/react-query';
import config from '@/config/env-config';
import { useGetClaimedPerks } from './useGetClaimedPerks';
import {
  usePerkClaimStatusStore,
  PerkClaimStatus,
} from 'src/stores/perkClaimStatus';
import {
  HttpResponse,
  PerkClaimDto,
  PerkClaimEntity,
} from 'src/types/jumper-backend';

export type ClaimPerkResult = HttpResponse<PerkClaimEntity, unknown>;

export async function claimPerkQuery(props: PerkClaimDto) {
  const apiBaseUrl = config.NEXT_PUBLIC_BACKEND_URL;
  const res = await fetch(`${apiBaseUrl}/perks/claim`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(props),
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  const data: ClaimPerkResult = await res.json();

  if (!data) {
    throw new Error('Invalid response');
  }

  return data;
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
