import { useAccountAddress } from '@/hooks/earn/useAccountAddress';
import { isProduction } from '@/utils/isProduction';
import { useQuery } from '@tanstack/react-query';

export enum GatekeeperStatus {
  REQUIRES_CONNECT = 'requires_wallet',
  LOADING_ACCESS = 'loading_access',
  SUCCESS = 'success',
  ERROR = 'error',
  NOT_ALLOWED = 'not_allowed',
}

interface GatekeeperData {
  status: GatekeeperStatus;
  error?: unknown;
}

const EARN_PUBLIC_RELEASE_DATE = new Date('2026-01-12T13:00:00Z');

const isEarnEnabledByDefault = (): boolean => {
  if (!isProduction) {
    return true;
  }
  return new Date() >= EARN_PUBLIC_RELEASE_DATE;
};

export const useGatekeeperStatus = (flag: string): GatekeeperData => {
  console.log('7. useGatekeeperStatus');

  const accountAddress = useAccountAddress();
  const earnEnabledByDefault = flag === 'hasEarn' && isEarnEnabledByDefault();

  const { data, isLoading, error } = useQuery({
    queryKey: ['flags', accountAddress, flag],
    queryFn: async () => {
      const response = await fetch(`/api/profile/${accountAddress}/flags`);

      if (!response.ok) {
        throw new Error('Failed to fetch wallet flags');
      }

      return response.json();
    },
    enabled: !!accountAddress && !earnEnabledByDefault,
  });

  // Enable hasEarn by default after the public release date (or always in non-production)
  if (earnEnabledByDefault) {
    return { status: GatekeeperStatus.SUCCESS };
  }

  if (!accountAddress) {
    return { status: GatekeeperStatus.REQUIRES_CONNECT };
  }

  if (isLoading) {
    return { status: GatekeeperStatus.LOADING_ACCESS };
  }

  if (error) {
    return { status: GatekeeperStatus.ERROR, error };
  }

  const hasAccess = Boolean(data?.[flag]);

  console.log('8. useGatekeeperStatus done', hasAccess);

  return {
    status: hasAccess ? GatekeeperStatus.SUCCESS : GatekeeperStatus.NOT_ALLOWED,
  };
};
