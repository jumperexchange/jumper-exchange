import type { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import { createWithEqualityFn } from 'zustand/traditional';

// config
import { defaultChains } from '@transferto/shared/src';
// @type
import { ExtendedChain } from '@lifi/sdk';
import type {
  ChainsProps,
  ChainsState,
} from '@transferto/shared/src/types/chains';
import { shallow } from 'zustand/shallow';

// ----------------------------------------------------------------------

/*--  Use Zustand  --*/
export const useChainsStore = createWithEqualityFn(
  persist(
    (set, get) => ({
      ...defaultChains,
      setValue: (key: keyof ChainsProps, value: any) =>
        set(() => ({
          [key]: value,
        })),
      setValues: (values: { [x: string]: any }) =>
        set((state: ChainsProps) => {
          const updatedState: ChainsProps = { ...state };
          for (const key in values) {
            if (Object.hasOwn(state, key)) {
              updatedState[key] = values[key];
            }
          }
          return updatedState;
        }),

      // Mode
      onChainsLoad: (chains: ExtendedChain[]) => {
        set({
          chains,
        });
      },

      // Reset
      onResetChains: () => {
        set({
          chains: defaultChains.data || [],
        });
      },
    }),
    {
      name: 'chains-store', // name of the item in the storage (must be unique)
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          const newStore = { ...persistedState };
          Object.keys(persistedState)
            .filter((el) => !(el in defaultChains))
            .forEach((el) => delete newStore[el]);
          return newStore;
        }
        return persistedState;
      },
      // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ) as unknown as StateCreator<ChainsState, [], [], ChainsState>,
  shallow,
);
