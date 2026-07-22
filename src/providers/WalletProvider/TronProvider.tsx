'use client';
import { createTronAdapters } from '@jumperexchange/widget-provider-tron';
import { WalletProvider } from '@tronweb3/tronwallet-adapter-react-hooks';
import { type FC, type PropsWithChildren, useState } from 'react';

export const TronProvider: FC<PropsWithChildren> = ({ children }) => {
  // Tron wallet adapters access `window` in their constructors and schedule
  // `setInterval` polls to detect installed wallets. Instantiating them during
  // SSR/SSG throws `ReferenceError: window is not defined` on every tick.
  // Only create them on the client so they are a no-op during prerendering.
  // `useState` (not `useMemo`) ensures the adapters are created exactly once;
  // `useMemo` is a perf hint and React may discard and recompute it, which
  // would leak adapter instances and their polling intervals.
  const [adapters] = useState(() =>
    typeof window === 'undefined' ? [] : createTronAdapters(),
  );

  return (
    <WalletProvider adapters={adapters} autoConnect={true}>
      {children}
    </WalletProvider>
  );
};
