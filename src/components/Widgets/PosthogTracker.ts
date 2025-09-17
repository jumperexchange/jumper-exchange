'use client';
import type { ChainPinned, RouteSelected } from '@lifi/widget';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const/trackingKeys';
import { UserTracking } from 'src/hooks/userTracking';
import { handleRouteData } from 'src/utils/routes';

export interface PosthogTrackerProps extends UserTracking {}

export interface PosthogTracker {
  onRouteSelected: (route: RouteSelected) => Promise<void>;
  onChainPinned: (chainPinned: ChainPinned) => Promise<void>;
}

export const makePosthogTracker = ({
  trackTransaction,
  trackEvent,
}: PosthogTrackerProps): PosthogTracker => {
  const onRouteSelected = async ({ route, routes }: RouteSelected) => {
    const position = routes.findIndex((r) => r.id === route.id);
    const data = handleRouteData(route, {
      [TrackingEventParameter.RoutePosition]: position,
      [TrackingEventParameter.TransactionStatus]: 'SELECTED',
    });

    trackTransaction({
      category: TrackingCategory.WidgetEvent,
      action: TrackingAction.OnRouteSelected,
      label: 'route_selected',
      data,
    });
  };

  const onChainPinned = async ({ chainId, pinned }: ChainPinned) => {
    trackEvent({
      category: TrackingCategory.WidgetEvent,
      action: TrackingAction.OnChainPinned,
      label: 'chain_pinned',
      data: {
        [TrackingEventParameter.ChainId]: chainId,
        [TrackingEventParameter.Pinned]: pinned,
      },
    });
  };

  return {
    onRouteSelected,
    onChainPinned,
  };
};
