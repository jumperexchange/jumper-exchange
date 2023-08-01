import { MultisigProps, MultisigState } from '@transferto/shared/src';
import { create } from 'zustand';

export const useMultisigStore = create<MultisigState>((set) => ({
  destinationChain: undefined,
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
  onDestinationChainSelected: (chainId: number) => {
    set({
      destinationChain: chainId,
    });
  },
}));
