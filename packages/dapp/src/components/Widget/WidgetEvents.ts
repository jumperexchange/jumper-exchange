import { Route } from '@lifi/sdk';
import {
  RouteExecutionUpdate,
  useWidgetEvents,
  WidgetEvent,
} from '@lifi/widget';
import { useEffect, useState } from 'react';
import { hotjar } from 'react-hotjar';
import { gaEventTrack } from '../../utils/google-analytics';

export function WidgetEvents() {
  const [lastTxHash, setLastTxHas] = useState<string>();

  const widgetEvents = useWidgetEvents();

  useEffect(() => {
    const onRouteExecutionStarted = async (route: Route) => {
      // console.log('onRouteExecutionStarted fired.', route);
      if (!!route?.id) {
        hotjar.initialized() && hotjar.event('onRouteExecutionStarted');
        gaEventTrack({
          category: 'widgetEvent',
          action: 'onRouteExecutionStarted',
          label: `${route.id}`,
        });
      }
    };
    const onRouteExecutionUpdated = async (update: RouteExecutionUpdate) => {
      // console.log('onRouteExecutionUpdated fired.', update);
      if (!!update?.process && !!update.route) {
        if (update.process.txHash !== lastTxHash) {
          // console.log({
          //   fromChainId: update.route.fromChainId,
          //   transactionHash: update.process.txHash,
          //   routeId: update.route.id,
          //   transactionLink: update.process.txLink,
          // });
          setLastTxHas(update.process.txHash);
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
      // console.log('onRouteExecutionCompleted fired.', route);
      if (!!route?.id) {
        hotjar.initialized() && hotjar.event('onRouteExecutionCompleted');
        gaEventTrack({
          category: 'widgetEvent',
          action: 'onRouteExecutionCompleted',
          label: `${route.id}`,
        });
      }
    };
    const onRouteExecutionFailed = async (update: RouteExecutionUpdate) => {
      // console.log('onRouteExecutionFailed fired.', update);
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
