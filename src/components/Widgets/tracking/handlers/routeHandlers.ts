import type { Route, RouteExecutionUpdate } from '@jumperexchange/widget';
import { isEqual, omit } from 'lodash';
import { TrackingEventParameter } from '@/const/trackingKeys';

import type { WidgetEventsConfig } from '@/components/Widgets/WidgetEventsManager';
import {
  trackWidgetEvent,
  trackWidgetTransaction,
} from '@/components/Widgets/tracking/trackWidgetEvent';
import type {
  HandlerContext,
  RouteExecutionEventConfig,
  WidgetEventConfig,
} from '@/components/Widgets/tracking/types';
import { handleRouteData } from '@/utils/routes';

const ROUTE_DIFF_OMIT_KEYS = [
  TrackingEventParameter.TransactionStatus,
  TrackingEventParameter.IsFinal,
  TrackingEventParameter.Action,
] as const;

export const createRouteExecutionStartedHandler = (
  config: RouteExecutionEventConfig,
  ctx: HandlerContext,
): WidgetEventsConfig => ({
  routeExecutionStarted: async (route: Route) => {
    if (!route.id) {
      return;
    }

    const routeData = handleRouteData(route, {
      [TrackingEventParameter.Action]: config.dataAction,
      [TrackingEventParameter.TransactionStatus]: 'STARTED',
      [TrackingEventParameter.TradeType]: ctx.session.activeTab ?? undefined,
      ...config.extraData,
    });

    ctx.session.setTrackedRoute(route.id, routeData);
    trackWidgetTransaction(ctx.tracking, config, 'execution_start', routeData);
  },
});

export const createRouteExecutionUpdatedHandler = (
  config: RouteExecutionEventConfig,
  ctx: HandlerContext,
): WidgetEventsConfig => ({
  routeExecutionUpdated: async (update: RouteExecutionUpdate) => {
    const updatedRouteData = handleRouteData(update.route, {
      [TrackingEventParameter.Action]: config.dataAction,
      [TrackingEventParameter.TransactionStatus]: 'UPDATED',
      [TrackingEventParameter.TradeType]: ctx.session.activeTab ?? undefined,
      ...config.extraData,
    });
    const routeData = ctx.session.getTrackedRoute(update.route.id);
    if (!routeData) {
      return;
    }

    const shouldTrack = !isEqual(
      omit(routeData, ROUTE_DIFF_OMIT_KEYS),
      omit(updatedRouteData, ROUTE_DIFF_OMIT_KEYS),
    );

    if (!shouldTrack) {
      return;
    }

    ctx.session.setTrackedRoute(update.route.id, updatedRouteData);
    trackWidgetTransaction(
      ctx.tracking,
      config,
      'execution_updated',
      updatedRouteData,
    );
  },
});

export const createRouteExecutionCompletedHandler = (
  config: RouteExecutionEventConfig,
  ctx: HandlerContext,
): WidgetEventsConfig => ({
  routeExecutionCompleted: async (route: Route) => {
    ctx.session.clearTrackedRoute(route.id);
    trackWidgetTransaction(
      ctx.tracking,
      config,
      'execution_success',
      handleRouteData(route, {
        [TrackingEventParameter.Action]: config.dataAction,
        [TrackingEventParameter.TransactionStatus]: 'COMPLETED',
        [TrackingEventParameter.TradeType]: ctx.session.activeTab ?? undefined,
        ...config.extraData,
      }),
      { isConversion: true },
    );
  },
});

export const createRouteExecutionFailedHandler = (
  config: RouteExecutionEventConfig,
  ctx: HandlerContext,
): WidgetEventsConfig => ({
  routeExecutionFailed: async (update: RouteExecutionUpdate) => {
    if (update.route.id) {
      ctx.session.clearTrackedRoute(update.route.id);
    }

    trackWidgetTransaction(
      ctx.tracking,
      config,
      'execution_error',
      handleRouteData(update.route, {
        [TrackingEventParameter.Action]: config.dataAction,
        [TrackingEventParameter.TransactionStatus]: 'FAILED',
        [TrackingEventParameter.TradeType]: ctx.session.activeTab ?? undefined,
        [TrackingEventParameter.Message]:
          update.action.error?.message || update.action.message || '',
        [TrackingEventParameter.IsFinal]: true,
        ...config.extraData,
      }),
    );
  },
});

export const createRouteSelectedHandler = (
  config: WidgetEventConfig,
  ctx: HandlerContext,
): WidgetEventsConfig => ({
  routeSelected: async ({ route, routes }) => {
    const position = routes.findIndex((r) => r.id === route.id);
    trackWidgetTransaction(
      ctx.tracking,
      config,
      'route_selected',
      handleRouteData(route, {
        [TrackingEventParameter.RoutePosition]: position,
        [TrackingEventParameter.TransactionStatus]: 'SELECTED',
        ...config.extraData,
      }),
      { enableAddressable: false },
    );
  },
});

export const createChainPinnedHandler = (
  config: WidgetEventConfig,
  ctx: HandlerContext,
): WidgetEventsConfig => ({
  chainPinned: async ({ chainId, pinned }) => {
    trackWidgetEvent(
      ctx.tracking,
      config,
      'chain_pinned',
      {
        [TrackingEventParameter.ChainId]: chainId,
        [TrackingEventParameter.Pinned]: pinned,
      },
      { enableAddressable: false },
    );
  },
});
