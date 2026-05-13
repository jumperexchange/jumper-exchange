'use client';
import {
  createDAppKit,
  DAppKitProvider,
  type DefaultExpectedDppKit,
} from '@mysten/dapp-kit-react';
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';
import { type FC, type PropsWithChildren, useRef } from 'react';
import { useHydrated } from '@/hooks/useHydrated';

export const SuiProvider: FC<PropsWithChildren> = ({ children }) => {
  const isHydrated = useHydrated();
  const dappKit = useRef<DefaultExpectedDppKit>(null);

  if (!isHydrated) {
    return <>{children}</>;
  }

  if (!dappKit.current) {
    dappKit.current = createDAppKit({
      networks: ['mainnet'],
      createClient: (network) =>
        new SuiGrpcClient({
          network,
          baseUrl: getJsonRpcFullnodeUrl('mainnet'),
        }),
      autoConnect: true,
      storageKey: 'jumper-sui-wallet-connection',
    });
  }

  return (
    <DAppKitProvider dAppKit={dappKit.current}>{children}</DAppKitProvider>
  );
};
