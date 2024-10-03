'use client';
import {
  BigmiProvider,
  createDefaultBigmiConfig,
  useReconnect,
} from '@lifi/wallet-management';
import { type FC, type PropsWithChildren } from 'react';

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
