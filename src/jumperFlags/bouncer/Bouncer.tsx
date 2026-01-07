'use client';

import type { ReactNode } from 'react';
import { useBouncer } from './useBouncer';

interface BouncerProps {
  loading?: boolean;
  blocked?: boolean;
  allowed?: boolean;
  children: ReactNode;
}

export const Bouncer = ({
  loading,
  blocked,
  allowed,
  children,
}: BouncerProps) => {
  const { status } = useBouncer();

  const noFlagsSet =
    loading === undefined && blocked === undefined && allowed === undefined;
  const effectiveAllowed = noFlagsSet ? true : (allowed ?? false);

  const shouldRender =
    (loading && status === 'loading') ||
    (blocked && status === 'blocked') ||
    (effectiveAllowed && status === 'allowed');

  if (!shouldRender) {
    return null;
  }

  return <>{children}</>;
};
