'use client';

import {
  hyperliquidProvider,
  hyperliquidWsProvider,
} from '@lifi/perps-sdk-provider-hyperliquid';
import {
  type PerpsClientsOptions,
  PerpsProvider,
  PerpsWalletProvider,
} from '@lifinance/perps-widget/react';
import { type ReactNode, useEffect, useState } from 'react';
import config from '@/config/env-config';

function createPerpsConfig(): PerpsClientsOptions {
  // Perps is served by the LiFi backend under /v1/perps and reached through the
  // same jumper-backend pipeline proxy as every other LiFi route; the proxy
  // injects the API key server-side, so no public key is needed here.
  const apiUrl = `${config.NEXT_PUBLIC_LIFI_BACKEND_URL}/v1/perps`;

  return {
    integrator: 'jumper-exchange-perps',
    apiUrl,
    providers: [hyperliquidProvider()],
    wsProviders: {
      hyperliquid: hyperliquidWsProvider(),
    },
  };
}

export function PerpsProviders({ children }: { children: ReactNode }) {
  const [clientsConfig, setClientsConfig] = useState<
    PerpsClientsOptions | undefined
  >();

  useEffect(() => {
    setClientsConfig(createPerpsConfig());
    // Pins the widget's own brand skin instead of exposing its default/jumper
    // ThemeSwitcher; Jumper's global theme is handled separately.
    document.body.setAttribute('data-theme', 'jumper');
    return () => {
      document.body.removeAttribute('data-theme');
    };
  }, []);

  if (!config.NEXT_PUBLIC_LIFI_BACKEND_URL) {
    return null;
  }

  if (!clientsConfig) {
    return null;
  }

  return (
    <PerpsWalletProvider
      walletConnectProjectId={config.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID}
    >
      <PerpsProvider config={clientsConfig}>{children}</PerpsProvider>
    </PerpsWalletProvider>
  );
}
