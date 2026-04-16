'use client';
import { createTronAdapters } from '@lifi/widget-provider-tron';
import { WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks';
import { type FC, type PropsWithChildren, useRef } from 'react';

export const TronProvider: FC<PropsWithChildren> = ({ children }) => {
  const adapters = useRef(null as ReturnType<typeof createTronAdapters> | null);

  if (!adapters.current) {
    adapters.current = createTronAdapters();
  }

  return (
    <WalletProvider adapters={adapters.current} autoConnect={true}>
      {children}
    </WalletProvider>
  );
};
