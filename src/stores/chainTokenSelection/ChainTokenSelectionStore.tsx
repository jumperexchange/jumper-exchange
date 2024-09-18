'use client';

import type { ChainId } from '@lifi/types';
import type { ChainTokenSelected } from '@lifi/widget';
import { createWithEqualityFn as create } from 'zustand/traditional';

interface OptionalChainTokenSelected {
  chainId?: ChainId;
  tokenAddress?: string;
}

interface ChainTokenSelectionState {
  sourceChainToken: OptionalChainTokenSelected;
  setSourceChainToken: (sourceChainToken: ChainTokenSelected) => void;
  destinationChainToken: OptionalChainTokenSelected;
  setDestinationChainToken: (destinationChainToken: ChainTokenSelected) => void;
}

const queryParameters =
  typeof window !== 'undefined' &&
  window?.location &&
  new URLSearchParams(window.location.search);
const fromChain = queryParameters && queryParameters.get('fromChain');
const fromToken = queryParameters && queryParameters.get('fromToken');
const toChain = queryParameters && queryParameters.get('toChain');
const toToken = queryParameters && queryParameters.get('toToken');

export const useChainTokenSelectionStore = create<ChainTokenSelectionState>(
  (set) => ({
    sourceChainToken: {
      tokenAddress: fromToken || undefined,
      chainId: (fromChain && (parseInt(fromChain) as ChainId)) || undefined,
    },
    setSourceChainToken: (sourceChainToken) =>
      set({
        sourceChainToken,
      }),
    destinationChainToken: {
      tokenAddress: toToken || undefined,
      chainId: (toChain && (parseInt(toChain) as ChainId)) || undefined,
    },
    setDestinationChainToken: (destinationChainToken) =>
      set({
        destinationChainToken,
      }),
  }),
  Object.is,
);
