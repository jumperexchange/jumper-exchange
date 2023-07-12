import { MultisigProps } from '@transferto/shared';
import { create } from 'zustand';

// ----------------------------------------------------------------------

/*--  Use Zustand  --*/

export const useMultisigStore = create((set) => ({
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
}));
