import { useArcxAnalytics } from '@arcxmoney/analytics';
import { Route } from '@lifi/sdk';
import {
  RouteExecutionUpdate,
  useWidgetEvents,
  WidgetEvent,
} from '@lifi/widget';
import { useEffect, useRef } from 'react';
import { hotjar } from 'react-hotjar';
import { gaEventTrack } from '../../utils/google-analytics';

export function WidgetEvents() {
  const lastTxHashRef = useRef<string>();
  const arcx = useArcxAnalytics();
  const widgetEvents = useWidgetEvents();

  useEffect(() => {
    const onRouteExecutionStarted = async (route: Route) => {
      if (!!route?.id) {
        await arcx?.event(
          'onRouteExecutionStarted', // required(string) - the name of the event (eg. "clicked-tab")
          {
            routeId: route.id,
            steps: route.steps,
            fromToken: route.fromToken,
            fromChainId: route.fromChainId,
            toToken: route.toToken,
            toChainId: route.toChainId,
            fromAmount: route.fromAmount,
            toAmount: route.toAmount,
          }, // optional(object) - additional information about the event
        );
        hotjar.initialized() && hotjar.event('onRouteExecutionStarted');
        gaEventTrack({
          category: 'widgetEvent',
          action: 'onRouteExecutionStarted',
          label: `${route.id}`,
        });
      }
    };
    const onRouteExecutionUpdated = async (update: RouteExecutionUpdate) => {
      if (!!update?.process && !!update.route) {
        if (update.process.txHash !== lastTxHashRef.current) {
          lastTxHashRef.current = update.process.txHash;
          await arcx?.transaction({
            chain: update.route.fromChainId, // required(string) - chain ID that the transaction is taking place on
            transactionHash: update.process.txHash, // required(string) - hash of the transaction
            metadata: {
              routeId: `${update.route.id}`,
              transactionLink: update.process.txLink,
              steps: update.route.steps,
              status: update.process.status,
            }, // optional(object) - additional information about the transaction
          });
          hotjar.initialized() && hotjar.event('onRouteExecutionUpdated');
          gaEventTrack({
            category: 'widgetEvent',
            action: 'onRouteExecutionUpdated',
            label: `${update?.process?.txHash}`,
          });
        }
      }
    };
    const onRouteExecutionCompleted = async (route: Route) => {
      if (!!route?.id) {
        await arcx?.event(
          'onRouteExecutionCompleted', // required(string) - the name of the event (eg. "clicked-tab")
          { steps: route.steps }, // optional(object) - additional information about the event
        );
        hotjar.initialized() && hotjar.event('onRouteExecutionCompleted');
        gaEventTrack({
          category: 'widgetEvent',
          action: 'onRouteExecutionCompleted',
          label: `${route.id}`,
        });
      }
    };
    const onRouteExecutionFailed = async (update: RouteExecutionUpdate) => {
      await arcx?.event(
        'onRouteExecutionFailed', // required(string) - the name of the event (eg. "clicked-tab")
        {
          routeId: update?.route?.id,
          transactionHash: update.process.txHash,
          status: update.process.status,
          message: update.process.message,
          error: update.process.error,
          steps: update.route.steps,
        }, // optional(object) - additional information about the event
      );
      hotjar.initialized() && hotjar.event('onRouteExecutionFailed');
      gaEventTrack({
        category: 'widgetEvent',
        action: 'onRouteExecutionFailed',
        label: `${update?.route?.id}`,
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
  }, [widgetEvents]);

  return null;
}
