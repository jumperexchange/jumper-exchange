'use client';

import { useStore } from 'zustand';
import { createContext, useContext, useRef, type ReactNode } from 'react';
import type { MarketManagerStoreApi } from './market-manager-props';
import { createMarketManagerStore } from './market-manager-props';

export const MarketManagerStoreContext = createContext<
  MarketManagerStoreApi | undefined
>(undefined);

export const MarketManagerStoreProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const storeRef = useRef<MarketManagerStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createMarketManagerStore();
  }

  return (
    <MarketManagerStoreContext.Provider value={storeRef.current}>
      {children}
    </MarketManagerStoreContext.Provider>
  );
};

export const useMarketManager = () => {
  const marketManagerStoreContext = useContext(MarketManagerStoreContext);

  if (!marketManagerStoreContext) {
    throw new Error(
      `useMarketManager must be used within MarketManagerStoreProvider`,
    );
  }

  return useStore(marketManagerStoreContext, (state) => state);
};
