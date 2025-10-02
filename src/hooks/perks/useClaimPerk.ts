import { useMutation } from '@tanstack/react-query';
import config from '@/config/env-config';
import {
  updateClaimedPerksQueryCache,
  useGetClaimedPerks,
} from './useGetClaimedPerks';
import {
  usePerkClaimStatusStore,
  PerkClaimStatus,
} from 'src/stores/perkClaimStatus';

interface ClaimPerkProps {
  perkId: string;
  address: string;
  signature: string;
  username?: string;
  walletType?: string;
  message: string;
}

export async function claimPerkQuery(props: ClaimPerkProps) {
  const apiBaseUrl = config.NEXT_PUBLIC_BACKEND_URL;
  await new Promise((resolve) => setTimeout(resolve, 10000));
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

  const data = await res.json();

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
    mutationFn: (props: ClaimPerkProps) => {
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
