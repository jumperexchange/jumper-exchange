'use client';

import { useAccountAddress } from '@/hooks/earn/useAccountAddress';
import { isProduction } from '@/utils/isProduction';
import { useJumperFlags } from '../useJumperFlags';

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

export const useGatekeeper = (flag: string): GatekeeperData => {
  const accountAddress = useAccountAddress();
  const { flags, isLoading, error } = useJumperFlags();
  const earnEnabledByDefault = flag === 'hasEarn' && isEarnEnabledByDefault();

  if (earnEnabledByDefault) {
    return { status: GatekeeperStatus.SUCCESS };
  }

  if (!accountAddress) {
    return { status: GatekeeperStatus.REQUIRES_CONNECT };
  }

  if (isLoading || !flags) {
    return { status: GatekeeperStatus.LOADING_ACCESS };
  }

  if (error) {
    return { status: GatekeeperStatus.ERROR, error };
  }

  const hasAccess = Boolean(flags[flag as keyof typeof flags]);

  return {
    status: hasAccess ? GatekeeperStatus.SUCCESS : GatekeeperStatus.NOT_ALLOWED,
  };
};
