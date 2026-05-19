'use client';
import {
  createDAppKit,
  DAppKitProvider,
  type DefaultExpectedDppKit,
} from '@mysten/dapp-kit-react';
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';
import { type FC, type PropsWithChildren, useEffect, useState } from 'react';

// Module-level singleton so createDAppKit is called at most once
// (guards against React StrictMode double-invoking effects).
let dappKitSingleton: DefaultExpectedDppKit | null = null;

export const SuiProvider: FC<PropsWithChildren> = ({ children }) => {
  const [dappKit, setDappKit] = useState<DefaultExpectedDppKit | null>(null);

  useEffect(() => {
    if (!dappKitSingleton) {
      dappKitSingleton = createDAppKit({
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
    setDappKit(dappKitSingleton);
  }, []);

  if (!dappKit) {
    return <>{children}</>;
  }

  return <DAppKitProvider dAppKit={dappKit}>{children}</DAppKitProvider>;
};
