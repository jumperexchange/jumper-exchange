import { MultisigState } from '@transferto/shared/src';
import { create } from 'zustand';

export const useMultisigStore = create<MultisigState>((set) => ({
  destinationChain: undefined,
  setValue: (key: keyof MultisigState, value: any) =>
    set(() => ({
      [key]: value,
    })),
  setValues: (values: { [x: string]: any }) =>
    set((state) => {
      const updatedState: { [key: string]: any } = { ...state };
      for (const key in values) {
        if (Object.hasOwn(values, key)) {
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
