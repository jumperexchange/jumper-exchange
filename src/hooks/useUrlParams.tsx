import { isEqual } from 'lodash';
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    __jumperHistoryPatched?: boolean;
  }
}

const URL_CHANGE_EVENT = 'jumperurlchange';

/**
 * `pushState`/`replaceState` never fire `popstate` (that only fires on
 * browser back/forward), yet the widget updates `fromChain`/`fromToken`/etc.
 * in the query string via the History API as the user picks tokens. Patch
 * both methods once so same-page URL changes are observable.
 */
function patchHistoryForUrlChangeEvent() {
  if (typeof window === 'undefined' || window.__jumperHistoryPatched) {
    return;
  }
  window.__jumperHistoryPatched = true;

  for (const method of ['pushState', 'replaceState'] as const) {
    const original = window.history[method];
    window.history[method] = function (...args) {
      const result = original.apply(this, args);
      queueMicrotask(() => window.dispatchEvent(new Event(URL_CHANGE_EVENT)));
      return result;
    };
  }
}

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

      const next: UrlParams = {
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
      };

      setUrlParams((prev) => (isEqual(prev, next) ? prev : next));
    };

    patchHistoryForUrlChangeEvent();

    // Initial update
    updateSelection();

    // Listen for browser back/forward navigation and same-page URL changes
    // (e.g. the widget syncing token selection via pushState/replaceState).
    window.addEventListener('popstate', updateSelection);
    window.addEventListener(URL_CHANGE_EVENT, updateSelection);

    return () => {
      window.removeEventListener('popstate', updateSelection);
      window.removeEventListener(URL_CHANGE_EVENT, updateSelection);
    };
  }, []);

  return urlParams;
};
