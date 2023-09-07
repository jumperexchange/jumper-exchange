import { MultisigState } from '@transferto/shared/src';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

export const useMultisigStore = createWithEqualityFn<MultisigState>(
  (set) => ({
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
  }),
  shallow,
);
