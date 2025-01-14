'use client';
import { createDefaultBigmiConfig } from '@lifi/wallet-management';
import { type FC, type PropsWithChildren } from 'react';
import { useReconnect, BigmiProvider } from '@bigmi/react';
const { config } = createDefaultBigmiConfig({
  bigmiConfig: {
    ssr: true,
    multiInjectedProviderDiscovery: false,
  },
});

export const UTXOProvider: FC<PropsWithChildren> = ({ children }) => {
  useReconnect(config);

  return (
    <BigmiProvider config={config} reconnectOnMount={false}>
      {children}
    </BigmiProvider>
  );
};
