'use client';

import { useAccountAddress } from '@/hooks/earn/useAccountAddress';
import { useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';
import { useReadContract } from 'wagmi';
import { base } from 'wagmi/chains';

interface GatekeeperProps extends React.PropsWithChildren {
  flag: string;
}

enum GatekeeperStatus {
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

const useGatekeeperStatus = (flag: string): GatekeeperData => {
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

export const Gatekeeper: React.FC<GatekeeperProps> = ({ children, flag }) => {
  const { status, error } = useGatekeeperStatus(flag);

  if (status === GatekeeperStatus.LOADING) {
    return <div>Loading...</div>;
  }

  if (status === GatekeeperStatus.REQUIRES_CONNECT) {
    return <div>Requires connect</div>;
  }

  if (status === GatekeeperStatus.LOADING_NFT) {
    return <div>Loading NFT</div>;
  }

  if (status === GatekeeperStatus.ERROR) {
    return (
      <div>
        <pre>Error: {error?.toString()}</pre>
      </div>
    );
  }

  if (status === GatekeeperStatus.NOT_ALLOWED) {
    return <div>Not allowed</div>;
  }

  return <>{children}</>;
};
