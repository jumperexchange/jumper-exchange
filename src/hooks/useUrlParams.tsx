import { useEffect, useState } from 'react';

interface ChainToken {
  chainId: number | undefined;
  token: string | undefined;
}

interface UrlParams {
  sourceChainToken: ChainToken;
  destinationChainToken: ChainToken;
  toAddress?: string;
  fromAmount?: string;
  denyBridges?: string[];
  denyExchanges?: string[];
}

const parseList = (value: string | null): string[] | undefined => {
  if (!value) {
    return undefined;
  }
  const items = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  return items.length > 0 ? items : undefined;
};

export const useUrlParams = (): UrlParams => {
  const [urlParams, setUrlParams] = useState<UrlParams>({
    sourceChainToken: {
      chainId: undefined,
      token: undefined,
    },
    destinationChainToken: {
      chainId: undefined,
      token: undefined,
    },
    toAddress: undefined,
    fromAmount: undefined,
    denyBridges: undefined,
    denyExchanges: undefined,
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
      const toAddress = queryParameters.get('toAddress');
      const fromAmount = queryParameters.get('fromAmount');
      const denyBridges = queryParameters.get('denyBridges');
      const denyExchanges = queryParameters.get('denyExchanges');

      setUrlParams({
        sourceChainToken: {
          chainId: !!fromChain ? parseInt(fromChain) : undefined,
          token: fromToken ?? undefined,
        },
        destinationChainToken: {
          chainId: !!toChain ? parseInt(toChain) : undefined,
          token: toToken ?? undefined,
        },
        toAddress: toAddress ?? undefined,
        fromAmount: fromAmount ?? undefined,
        denyBridges: parseList(denyBridges),
        denyExchanges: parseList(denyExchanges),
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

  return urlParams;
};
