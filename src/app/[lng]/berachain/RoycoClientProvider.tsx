'use client';

import { RoycoProvider } from 'royco';
import React, { useMemo } from 'react';
import { useChains } from '@/hooks/useChains';
import { chain } from 'lodash';
import type { TypedRpcApiKeys } from 'royco/client';

export const RoycoClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { chains } = useChains();

  const rpcKeys = useMemo(
    () =>
      chains?.reduce((acc, item) => {
        acc[item.id] = item.metamask.rpcUrls[0]; // Set the key as the `id` and value as an empty array
        return acc;
      }, {} as TypedRpcApiKeys),
    [chains],
  );

  return (
    <RoycoProvider
      originUrl={process.env.NEXT_PUBLIC_ROYCO_URL!}
      originKey={process.env.NEXT_PUBLIC_ROYCO_KEY!}
      originId={process.env.NEXT_PUBLIC_ROYCO_ID!}
      rpcApiKeys={rpcKeys}
    >
      {/* @ts-ignore */}
      {children}
    </RoycoProvider>
  );
};
