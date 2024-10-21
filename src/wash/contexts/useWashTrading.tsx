import { createContext, useContext, useEffect } from 'react';
import { useGetCollection } from '../hooks/useGetCollection';
import { type TGetItems, useGetItems } from '../hooks/useGetItems';
import { type TGetNFT, useGetNFT } from '../hooks/useGetNFT';
import { type TUseMint, useMint } from '../hooks/useMint';
import { useReveal } from '../hooks/useReveal';
import { type TUseWash, useWash } from '../hooks/useWash';
import { useWidgetEvents, WidgetEvent } from '@lifi/widget';

import type { ReactElement } from 'react';
import type { TGetCollection } from '../hooks/useGetCollection';
import type { TRevealHook } from '../hooks/useReveal';
import type { Process, Route } from '@lifi/widget';
import type { TGetQuests } from '../hooks/useGetQuests';
import { useGetQuests } from '../hooks/useGetQuests';

type TWashTradingContext = {
  nft: TGetNFT;
  mint: TUseMint;
  reveal: TRevealHook;
  wash: TUseWash;
  items: TGetItems;
  collection: TGetCollection;
  activeQuests: TGetQuests;
};

const WashTradingContext = createContext<TWashTradingContext>({
  nft: {
    isLoading: false,
    hasNFT: false,
    error: null,
    refetch: undefined,
  },
  mint: {
    onMint: () => {},
    mintStatus: '',
    isMinting: false,
    error: undefined,
  },
  reveal: {
    onReveal: () => {},
    isRevealing: false,
    hasCanceledReveal: false,
    error: undefined,
    revealStatus: '',
  },
  wash: {
    onWash: async () => {},
    isWashing: false,
    error: '',
    washStatus: '',
  },
  items: {
    isLoading: false,
    items: undefined,
    error: undefined,
    refetch: undefined,
  },
  collection: {
    collection: undefined,
    isLoading: false,
    error: null,
    refetch: undefined,
    hasCollection: false,
  },
  activeQuests: {
    activeQuests: undefined,
    isLoading: false,
    error: undefined,
    refetch: undefined,
  },
});
export function WashTradingContextApp({
  children,
}: {
  children: ReactElement;
}): ReactElement {
  const nft = useGetNFT();
  const items = useGetItems();
  const wash = useWash(items.refetch, nft.refetch);
  const mint = useMint(nft.refetch);
  const reveal = useReveal(nft.refetch);
  const collection = useGetCollection();
  const activeQuests = useGetQuests();

  const widgetEvents = useWidgetEvents();

  useEffect(() => {
    const onRouteExecutionCompleted = (props: {
      process: Process;
      route: Route;
    }): void => {
      console.warn('route', props.route);
      fetch('/api/wash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: props.route.id,
          fromAddress: props.route.fromAddress,
          fromAmount: props.route.fromAmount,
          fromAmountUSD: props.route.fromAmountUSD,
          fromChainID: props.route.fromChainId,
          toAddress: props.route.toAddress,
          toAmount: props.route.toAmount,
          toAmountUSD: props.route.toAmountUSD,
          toChainID: props.route.toChainId,
        }),
      });
    };

    widgetEvents.on(
      WidgetEvent.RouteExecutionUpdated,
      onRouteExecutionCompleted,
    );

    return () =>
      widgetEvents.off(
        WidgetEvent.RouteExecutionCompleted,
        onRouteExecutionCompleted,
      );
  }, [widgetEvents]);

  return (
    <WashTradingContext.Provider
      value={{ reveal, items, nft, wash, mint, collection, activeQuests }}
    >
      {children}
    </WashTradingContext.Provider>
  );
}

export const useWashTrading = (): TWashTradingContext =>
  useContext(WashTradingContext);
