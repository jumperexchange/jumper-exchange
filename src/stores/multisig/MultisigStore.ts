import type { MultisigState } from '@/types/multisig';
import type { ChainId } from '@lifi/types';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn as create } from 'zustand/traditional';

export const useMultisigStore = create<MultisigState>(
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
