import { useAccountAddress } from '@/hooks/earn/useAccountAddress';
import { useQuery } from '@tanstack/react-query';

export enum GatekeeperStatus {
  LOADING = 'loading',
  REQUIRES_CONNECT = 'requires_wallet',
  LOADING_NFT = 'loading_access',
  SUCCESS = 'success',
  ERROR = 'error',
  NOT_ALLOWED = 'not_allowed',
}

interface GatekeeperData {
  status: GatekeeperStatus;
  error?: unknown;
}

export const useGatekeeperStatus = (flag: string): GatekeeperData => {
  const accountAddress = useAccountAddress();

  const { data, isLoading, error } = useQuery({
    queryKey: ['flags', accountAddress, flag],
    queryFn: async () => {
      const response = await fetch(`/api/profile/${accountAddress}/flags`);

      if (!response.ok) {
        throw new Error('Failed to fetch wallet flags');
      }

      return response.json();
    },
    enabled: !!accountAddress,
  });

  if (!accountAddress) {
    return { status: GatekeeperStatus.REQUIRES_CONNECT };
  }

  if (isLoading) {
    return { status: GatekeeperStatus.LOADING_NFT };
  }

  if (error) {
    return { status: GatekeeperStatus.ERROR, error };
  }

  const hasAccess = Boolean(data?.[flag]) ?? false;

  return {
    status: hasAccess ? GatekeeperStatus.SUCCESS : GatekeeperStatus.NOT_ALLOWED,
  };
};
