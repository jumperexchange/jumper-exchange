'use client';

import { useAccountAddress } from '@/hooks/earn/useAccountAddress';
import { useJumperFlags } from '../useJumperFlags';
import type { BouncerStatus } from '../types';

interface UseBouncerResult {
  status: BouncerStatus;
}

export const useBouncer = (): UseBouncerResult => {
  const accountAddress = useAccountAddress();
  const { flags, isLoading } = useJumperFlags();

  if (!accountAddress) {
    return { status: 'allowed' };
  }

  if (isLoading || !flags) {
    return { status: 'loading' };
  }

  if (flags.access === 'BLOCKED') {
    return { status: 'blocked' };
  }

  return { status: 'allowed' };
};
