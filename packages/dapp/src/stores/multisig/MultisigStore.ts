import { MultisigProps, MultisigState } from '@transferto/shared';
import type { StateCreator } from 'zustand';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ----------------------------------------------------------------------

/*--  Use Zustand  --*/

export const useMultisigStore = create(
  persist(
    (set) => ({
      setValue: (key, value) =>
        set(() => ({
          [key]: value,
        })),
      setValues: (values) =>
        set((state) => {
          const updatedState: MultisigProps = { ...state };
          for (const key in values) {
            if (Object.hasOwn(state, key)) {
              updatedState[key] = values[key];
            }
          }
          return updatedState;
        }),

      // Destination Chain
      onDestinationChainSelected: (chainId: number) => {
        set({
          destinationChain: chainId,
        });
      },
    }),
    {
      name: 'jumper-multisig-store', // name of the item in the storage (must be unique)
      // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ) as unknown as StateCreator<MultisigState, [], [], MultisigState>,
);
