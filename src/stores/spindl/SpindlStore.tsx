'use client';
import type { FeatureCardData } from 'src/types/strapi';
import { createWithEqualityFn } from 'zustand/traditional';

interface SpindlState {
  spindl: FeatureCardData[];
  setSpindl: (items: FeatureCardData[]) => void;
}

export const useSpindlStore = createWithEqualityFn<SpindlState>(
  (set) => ({
    spindl: [], //TabsMap.Exchange.index,
    setSpindl: (items) => set({ spindl: items }),
  }),
  Object.is,
);
