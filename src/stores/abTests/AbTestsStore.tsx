'use client';
import { AbTestConfig, type AbTestName } from 'src/const/abtests';
import { createWithEqualityFn } from 'zustand/traditional';

interface AbTestsState {
  activeAbTests: Record<AbTestName, boolean>;
  setActiveAbTest: (test: AbTestName, isActive: boolean) => void;
}

export const useAbTestsStore = createWithEqualityFn<AbTestsState>(
  (set) => ({
    activeAbTests: Object.keys(AbTestConfig.tests).reduce(
      (acc, test) => ({
        ...acc,
        [test]:
          AbTestConfig.tests[test as keyof typeof AbTestConfig.tests].enabled,
      }),
      {} as Record<AbTestName, boolean>,
    ),
    setActiveAbTest: (test, isActive) =>
      set((state) => ({
        activeAbTests: {
          ...state.activeAbTests,
          [test]: isActive,
        },
      })),
  }),
  Object.is,
);
