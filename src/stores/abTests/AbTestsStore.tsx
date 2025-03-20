'use client';
import { AbTestConfig, type AbTestName } from 'src/const/abtests';
import { createWithEqualityFn } from 'zustand/traditional';

interface AbTestsState {
  activeTests: Record<AbTestName, boolean>;
  setActiveTest: (test: AbTestName, isActive: boolean) => void;
}

export const useAbTestsStore = createWithEqualityFn<AbTestsState>(
  (set) => ({
    activeTests: Object.keys(AbTestConfig.tests).reduce(
      (acc, test) => ({
        ...acc,
        [test]:
          AbTestConfig.tests[test as keyof typeof AbTestConfig.tests].enabled,
      }),
      {} as Record<AbTestName, boolean>,
    ),
    setActiveTest: (test, isActive) =>
      set((state) => ({
        activeTests: {
          ...state.activeTests,
          [test]: isActive,
        },
      })),
  }),
  Object.is,
);
