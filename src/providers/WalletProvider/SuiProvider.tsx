'use client';
import {
  createDAppKit,
  DAppKitProvider,
  type DefaultExpectedDppKit,
} from '@mysten/dapp-kit-react';
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';
import type { FC, PropsWithChildren } from 'react';

// Module-level singleton: createDAppKit is called at most once per Node.js
// process (SSR) or browser tab.
//
// Why this matters:
//   1. SSR memory leak — without a singleton, each SSR request would call
//      createDAppKit and allocate a fresh SuiGrpcClient + nanostores graph
//      that is never released after the response.
//   2. Slush wallet's default `getDefaultAppName()` reads `document.title`,
//      which throws "ReferenceError: document is not defined" on SSR. Passing
//      `appName` explicitly bypasses that branch and keeps Slush registered
//      on both server and client.
//   3. Establishing DAppKitContext eagerly stops @lifi/widget-provider-sui's
//      SuiWidgetProvider from falling through to its own SuiBaseProvider,
//      which has the same per-render `createDAppKit` anti-pattern internally.
const dappKit: DefaultExpectedDppKit = createDAppKit({
  networks: ['mainnet'],
  createClient: (network) =>
    new SuiGrpcClient({
      network,
      baseUrl: getJsonRpcFullnodeUrl('mainnet'),
    }),
  autoConnect: true,
  storageKey: 'jumper-sui-wallet-connection',
  slushWalletConfig: { appName: 'Jumper' },
});

export const SuiProvider: FC<PropsWithChildren> = ({ children }) => {
  return <DAppKitProvider dAppKit={dappKit}>{children}</DAppKitProvider>;
};
