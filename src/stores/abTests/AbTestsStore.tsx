'use client';
import { createWithEqualityFn } from 'zustand/traditional';

interface ABTest {
  [testId: string]: boolean;
}

interface ABTestStoreState {
  abtests: ABTest;
  setAbtest: (testId: string, value: boolean) => void;
}

export const useABTestStore = createWithEqualityFn<ABTestStoreState>(
  (set) => ({
    abtests: {},
    setAbtest: (testId, value) =>
      set((state) => ({
        abtests: {
          ...state.abtests,
          [testId]: value,
        },
      })),
  }),
  Object.is,
);
