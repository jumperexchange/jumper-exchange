'use client';

import { createWithEqualityFn } from 'zustand/traditional';

interface LimitOrdersFilterState {
  protocolFilter: string | undefined;
  setProtocolFilter: (tool: string | undefined) => void;
}

export const useLimitOrdersFilterStore =
  createWithEqualityFn<LimitOrdersFilterState>(
    (set) => ({
      protocolFilter: undefined,
      setProtocolFilter: (tool) => set({ protocolFilter: tool }),
    }),
    Object.is,
  );
