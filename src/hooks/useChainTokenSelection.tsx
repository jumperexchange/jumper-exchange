import { useEffect, useState } from 'react';

interface ChainToken {
  chainId: number | undefined;
  token: string | undefined;
}

interface ChainTokenSelection {
  sourceChainToken: ChainToken;
  destinationChainToken: ChainToken;
}

export const useChainTokenSelection = (): ChainTokenSelection => {
  const [chainTokenSelection, setChainTokenSelection] =
    useState<ChainTokenSelection>({
      sourceChainToken: {
        chainId: undefined,
        token: undefined,
      },
      destinationChainToken: {
        chainId: undefined,
        token: undefined,
      },
    });

  useEffect(() => {
    const updateSelection = () => {
      if (typeof window === 'undefined') {
        return;
      }

      const queryParameters = new URLSearchParams(window.location.search);
      const fromChain = queryParameters.get('fromChain');
      const toChain = queryParameters.get('toChain');
      const fromToken = queryParameters.get('fromToken');
      const toToken = queryParameters.get('toToken');

      setChainTokenSelection({
        sourceChainToken: {
          chainId: !!fromChain ? parseInt(fromChain) : undefined,
          token: fromToken ?? undefined,
        },
        destinationChainToken: {
          chainId: !!toChain ? parseInt(toChain) : undefined,
          token: toToken ?? undefined,
        },
      });
    };

    // Initial update
    updateSelection();

    // Listen for changes in the URL
    window.addEventListener('popstate', updateSelection);

    // Clean up the event listener
    return () => {
      window.removeEventListener('popstate', updateSelection);
    };
  }, []);

  return chainTokenSelection;
};
