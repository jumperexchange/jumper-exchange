import { useEffect, useState } from 'react';

interface ChainToken {
  chainId: string | null;
  token: string | null;
}

interface ChainTokenSelection {
  sourceChainToken: ChainToken;
  destinationChainToken: ChainToken;
}

export const useChainTokenSelection = (): ChainTokenSelection => {
  const [chainTokenSelection, setChainTokenSelection] =
    useState<ChainTokenSelection>({
      sourceChainToken: {
        chainId: null,
        token: null,
      },
      destinationChainToken: {
        chainId: null,
        token: null,
      },
    });

  useEffect(() => {
    const updateSelection = () => {
      if (typeof window === 'undefined') {
        return;
      }

      const queryParameters = new URLSearchParams(window.location.search);
      setChainTokenSelection({
        sourceChainToken: {
          chainId: queryParameters.get('fromChain'),
          token: queryParameters.get('fromToken'),
        },
        destinationChainToken: {
          chainId: queryParameters.get('toChain'),
          token: queryParameters.get('toToken'),
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
