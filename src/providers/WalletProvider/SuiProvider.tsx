'use client';
import { siteName } from '@/app/lib/metadata';
import {
  createDAppKit,
  DAppKitProvider,
  type DefaultExpectedDppKit,
} from '@mysten/dapp-kit-react';
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';
import { type FC, type PropsWithChildren, useRef } from 'react';

export const SuiProvider: FC<PropsWithChildren> = ({ children }) => {
  const dappKit = useRef<DefaultExpectedDppKit>(null);

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
      slushWalletConfig: { appName: siteName },
    });
  }

  return (
    <DAppKitProvider dAppKit={dappKit.current}>{children}</DAppKitProvider>
  );
};
