'use client';
import { createTronAdapters } from '@lifi/widget-provider-tron';
import { WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks';
import { type FC, type PropsWithChildren, useMemo } from 'react';

export const TronProvider: FC<PropsWithChildren> = ({ children }) => {
  // Tron wallet adapters access `window` in their constructors and schedule
  // `setInterval` polls to detect installed wallets. Instantiating them during
  // SSR/SSG throws `ReferenceError: window is not defined` on every tick.
  // Only create them on the client so they are a no-op during prerendering.
  const adapters = useMemo(
    () => (typeof window === 'undefined' ? [] : createTronAdapters()),
    [],
  );

  return (
    <WalletProvider adapters={adapters} autoConnect={true}>
      {children}
    </WalletProvider>
  );
};
