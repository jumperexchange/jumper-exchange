import { Route } from '@lifi/sdk';
import { useUserTracking } from '../../hooks';

import {
  RouteExecutionUpdate,
  useWidgetEvents,
  WidgetEvent,
} from '@lifi/widget';
import { useEffect, useRef } from 'react';

export function WidgetEvents() {
  const lastTxHashRef = useRef<string>();
  const { trackEvent, trackTransaction } = useUserTracking();

  const widgetEvents = useWidgetEvents();

  useEffect(() => {
    const onRouteExecutionStarted = async (route: Route) => {
      if (!!route?.id) {
        trackEvent({
          category: 'widget-event',
          action: 'onRouteExecutionStarted',
          data: {
            routeId: route.id,
            steps: route.steps,
            fromToken: route.fromToken,
            fromChainId: route.fromChainId,
            toToken: route.toToken,
            toChainId: route.toChainId,
            fromAmount: route.fromAmount,
            toAmount: route.toAmount,
          },
        });
      }
    };
    const onRouteExecutionUpdated = async (update: RouteExecutionUpdate) => {
      if (!!update?.process && !!update.route) {
        if (update.process.txHash !== lastTxHashRef.current) {
          lastTxHashRef.current = update.process.txHash;
          trackTransaction({
            chain: update.route.fromChainId,
            transactionHash: update.process.txHash,
            category: 'widget-event',
            action: 'onRouteExecutionUpdated',
            data: {
              routeId: `${update.route.id}`,
              transactionLink: update.process.txLink,
              steps: update.route.steps,
              status: update.process.status,
              nonInteraction: true,
            },
          });
        }
      }
    };
    const onRouteExecutionCompleted = async (route: Route) => {
      if (!!route?.id) {
        trackEvent({
          category: 'widget-event',
          action: 'onRouteExecutionCompleted',
          data: {
            routeId: route.id,
            steps: route.steps,
            fromChainId: route.fromChainId,
            fromAmountUSD: route.fromAmountUSD,
            fromAmount: route.fromAmount,
            fromToken: route.fromToken,
            fromAddress: route.fromAddress,
            toChainId: route.toChainId,
            toAmountUSD: route.toAmountUSD,
            toAmount: route.toAmount,
            toAmountMin: route.toAmountMin,
            toToken: route.toToken,
          },
        });
      }
    };
    const onRouteExecutionFailed = async (update: RouteExecutionUpdate) => {
      trackEvent({
        category: 'widget-event',
        action: 'onRouteExecutionFailed',
        data: {
          routeId: update?.route?.id,
          transactionHash: update.process.txHash,
          status: update.process.status,
          message: update.process.message,
          error: update.process.error,
          steps: update.route.steps,
        },
      });
    };

    widgetEvents.on(WidgetEvent.RouteExecutionStarted, onRouteExecutionStarted);
    widgetEvents.on(WidgetEvent.RouteExecutionUpdated, onRouteExecutionUpdated);
    widgetEvents.on(
      WidgetEvent.RouteExecutionCompleted,
      onRouteExecutionCompleted,
    );
    widgetEvents.on(WidgetEvent.RouteExecutionFailed, onRouteExecutionFailed);

    return () => widgetEvents.all.clear();
  }, [trackEvent, trackTransaction, widgetEvents]);

  return null;
}
