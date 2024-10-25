'use client';

import { createContext, useContext, useEffect } from 'react';
import { useGetCollection } from '../hooks/useGetCollection';
import type { TGetUser } from '../hooks/useGetUser';
import { useGetUser } from '../hooks/useGetUser';
import { type TGetNFT, useGetNFT } from '../hooks/useGetNFT';
import { type TUseMint, useMint } from '../hooks/useMint';
import { useReveal } from '../hooks/useReveal';
import { type TUseWash, useWash } from '../hooks/useWash';
import { useWidgetEvents, WidgetEvent } from '@lifi/widget';

import type { ReactElement } from 'react';
import type { TGetCollection } from '../hooks/useGetCollection';
import type { TRevealHook } from '../hooks/useReveal';
import type {
  LiFiStep,
  Process,
  Route,
  RouteExecutionUpdate,
} from '@lifi/widget';

type TWashTradingContext = {
  nft: TGetNFT;
  mint: TUseMint;
  reveal: TRevealHook;
  wash: TUseWash;
  user: TGetUser;
  collection: TGetCollection;
};

const defaultArgs: TWashTradingContext = {
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
  user: {
    isLoading: false,
    items: undefined,
    quests: undefined,
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
};

const WashTradingContext = createContext<TWashTradingContext>(defaultArgs);
export function WashTradingContextApp(props: {
  children: ReactElement;
}): ReactElement {
  const user = useGetUser();
  const collection = useGetCollection();
  const nft = useGetNFT(user.refetch);
  const wash = useWash(user.refetch, nft.refetch);
  const mint = useMint(nft.refetch, user.refetch, collection.refetch);
  const reveal = useReveal(nft.refetch, collection.refetch);
  const widgetEvents = useWidgetEvents();

  useEffect(() => {
    const onFailed = async (props: RouteExecutionUpdate): Promise<void> => {
      console.warn('Failed', props);
      const txHash = props.process.txHash;
      const doneAt = Number((props.process.doneAt || 0) / 1000);
      if (txHash) {
        await fetch('/api/wash', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: props.route.id,
            txHash,
            fromAddress: props.route.fromAddress,
            fromToken: props.route.fromToken,
            fromAmount: props.route.fromAmount,
            fromAmountUSD: props.route.fromAmountUSD,
            fromChainID: props.route.fromChainId,
            toAddress: props.route.toAddress,
            toToken: props.route.toToken,
            toAmount: props.route.toAmount,
            toAmountUSD: props.route.toAmountUSD,
            toChainID: props.route.toChainId,
            timestamp: doneAt,
          }),
        });
        Promise.all([nft.refetch?.(), user.refetch?.()]);
      }
    };

    const onCompleted = async (route: Route): Promise<void> => {
      console.warn('Success', route);
      let txHash: string | undefined = undefined;
      let doneAt: number | undefined = undefined;
      let toAmount: number = Number(route.toAmount);
      if (route.steps.length > 0) {
        const firstStep = route.steps[0] as LiFiStep & {
          execution: { process: Process[]; toAmount: string };
        };
        if ((firstStep?.execution?.process || []).length > 0) {
          const firstExecution = firstStep.execution.process[0];
          toAmount = Number(firstStep.execution.toAmount);
          if (firstExecution) {
            txHash = firstExecution.txHash;
            doneAt = Number((firstExecution.doneAt || 0) / 1000);
          }
        }
      }

      if (txHash) {
        await fetch('/api/wash', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: route.id,
            txHash,
            fromAddress: route.fromAddress,
            fromToken: route.fromToken,
            fromAmount: route.fromAmount,
            fromAmountUSD: route.fromAmountUSD,
            fromChainID: route.fromChainId,
            toAddress: route.toAddress,
            toToken: route.toToken,
            toAmount: toAmount,
            toAmountUSD: route.toAmountUSD,
            toChainID: route.toChainId,
            timestamp: doneAt,
          }),
        });
        await Promise.all([nft.refetch?.(), user.refetch?.()]);
      }
    };

    widgetEvents.on(WidgetEvent.RouteExecutionCompleted, onCompleted);
    widgetEvents.on(WidgetEvent.RouteExecutionFailed, onFailed);

    return () => {
      widgetEvents.off(WidgetEvent.RouteExecutionCompleted, onCompleted);
      widgetEvents.off(WidgetEvent.RouteExecutionFailed, onFailed);
    };
  }, [widgetEvents, nft.refetch, user.refetch, nft, user, collection]);

  return (
    <WashTradingContext.Provider
      value={{ reveal, user, nft, wash, mint, collection }}
    >
      {props.children}
    </WashTradingContext.Provider>
  );
}

export const useWashTrading = (): TWashTradingContext =>
  useContext(WashTradingContext);
