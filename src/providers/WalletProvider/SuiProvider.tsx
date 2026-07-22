'use client';
import {
  createDAppKit,
  DAppKitProvider,
  type DefaultExpectedDppKit,
} from '@mysten/dapp-kit-react';
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';
import { useHydrated } from '@/hooks/useHydrated';
import type { FC, PropsWithChildren } from 'react';

const STORAGE_KEY = 'jumper-sui-wallet-connection';

// Module-level singletons: `createDAppKit` is called at most once per stub /
// client kit per Node.js process (SSR) or browser tab.
//
// Why this matters:
//   1. SSR memory leak — without a singleton, each SSR request would call
//      `createDAppKit` and allocate a fresh SuiGrpcClient + nanostores graph
//      that is never released after the response.
//   2. Slush wallet must not initialize during SSR. Its default
//      `getDefaultAppName()` reads `document.title` (throws on SSR), and
//      registration fetches metadata from api.slush.app via code paths that
//      eventually access `window`. Pre-hydration we pass `slushWalletConfig:
//      null` to disable it entirely; post-hydration we pass `appName`
//      explicitly so the client kit never hits the `document.title` fallback.
//   3. Establishing `DAppKitContext` eagerly (via the pre-hydration stub)
//      stops @jumperexchange/widget-provider-sui's `SuiWidgetProvider` from falling
//      through to its own `SuiBaseProvider`, which has the same per-render
//      `createDAppKit` anti-pattern internally.

const createSuiDappKit = (options: {
  autoConnect: boolean;
  slushWalletConfig: { appName: string } | null;
  storage?: null;
}): DefaultExpectedDppKit =>
  createDAppKit({
    networks: ['mainnet'],
    createClient: (network) =>
      new SuiGrpcClient({
        network,
        baseUrl: getJsonRpcFullnodeUrl('mainnet'),
      }),
    autoConnect: options.autoConnect,
    storageKey: STORAGE_KEY,
    ...(options.storage === null ? { storage: null } : {}),
    slushWalletConfig: options.slushWalletConfig,
  });

// Pre-hydration stub (see points 2 & 3 above).
let ssrDappKit: DefaultExpectedDppKit | null = null;

const getSsrDappKit = (): DefaultExpectedDppKit => {
  if (!ssrDappKit) {
    ssrDappKit = createSuiDappKit({
      autoConnect: false,
      slushWalletConfig: null,
      storage: null,
    });
  }
  return ssrDappKit;
};

// Full client kit (see point 2 above).
let clientDappKit: DefaultExpectedDppKit | null = null;

const getClientDappKit = (): DefaultExpectedDppKit => {
  if (!clientDappKit) {
    clientDappKit = createSuiDappKit({
      autoConnect: true,
      slushWalletConfig: { appName: 'Jumper' },
    });
  }
  return clientDappKit;
};

export const SuiProvider: FC<PropsWithChildren> = ({ children }) => {
  const isHydrated = useHydrated();

  const dappKit = isHydrated ? getClientDappKit() : getSsrDappKit();

  return <DAppKitProvider dAppKit={dappKit}>{children}</DAppKitProvider>;
};
