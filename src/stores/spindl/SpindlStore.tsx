'use client';
import type { SpindlCardData } from 'src/types/spindl';
import { createWithEqualityFn } from 'zustand/traditional';

interface SpindlState {
  spindl: SpindlCardData[];
  setSpindl: (items: SpindlCardData[]) => void;
}

export const useSpindlStore = createWithEqualityFn<SpindlState>(
  (set) => ({
    spindl: [], //TabsMap.Exchange.index,
    setSpindl: (items) => set({ spindl: items }),
  }),
  Object.is,
);
