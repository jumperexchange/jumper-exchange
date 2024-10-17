import type { MultisigState } from '@/types/multisig';
import type { ChainId } from '@lifi/sdk';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

export const useMultisigStore = createWithEqualityFn<MultisigState>(
  (set) => ({
    destinationChain: undefined,

    setDestinationChain: (chainId: ChainId) => {
      set({
        destinationChain: chainId,
      });
    },
  }),
  shallow,
);
