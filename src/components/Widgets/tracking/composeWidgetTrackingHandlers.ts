import type { WidgetEventsConfig } from 'src/components/Widgets/WidgetEventsManager';
import { createAvailableRoutesHandler } from 'src/components/Widgets/tracking/handlers/availableRoutes';
import {
  createDestinationChainTokenHandler,
  createSourceChainTokenHandler,
} from 'src/components/Widgets/tracking/handlers/chainTokenHandlers';
import {
  createChainPinnedHandler,
  createRouteExecutionCompletedHandler,
  createRouteExecutionFailedHandler,
  createRouteExecutionStartedHandler,
  createRouteExecutionUpdatedHandler,
  createRouteSelectedHandler,
} from 'src/components/Widgets/tracking/handlers/routeHandlers';
import {
  createChangeSettingsHandler,
  createFormFieldChangedHandler,
  createLowAddressActivityConfirmedHandler,
  createRouteHighValueLossHandler,
  createSendToWalletToggledHandler,
} from 'src/components/Widgets/tracking/handlers/widgetInteractionHandlers';
import type {
  HandlerContext,
  RouteExecutionEventConfig,
  WidgetEventConfig,
  WidgetEventTrackerConfig,
} from 'src/components/Widgets/tracking/types';

type HandlerFactory = (
  config: WidgetEventConfig | RouteExecutionEventConfig,
  ctx: HandlerContext,
) => WidgetEventsConfig;

const HANDLER_REGISTRY: Partial<
  Record<keyof WidgetEventTrackerConfig, HandlerFactory>
> = {
  sourceChainAndTokenSelection: createSourceChainTokenHandler,
  destinationChainAndTokenSelection: createDestinationChainTokenHandler,
  availableRoutes: createAvailableRoutesHandler,
  routeExecutionStarted: createRouteExecutionStartedHandler as HandlerFactory,
  routeExecutionUpdated: createRouteExecutionUpdatedHandler as HandlerFactory,
  routeExecutionCompleted:
    createRouteExecutionCompletedHandler as HandlerFactory,
  routeExecutionFailed: createRouteExecutionFailedHandler as HandlerFactory,
  changeSettings: createChangeSettingsHandler,
  routeHighValueLoss: createRouteHighValueLossHandler,
  lowAddressActivityConfirmed: createLowAddressActivityConfirmedHandler,
  sendToWalletToggled: createSendToWalletToggledHandler,
  formFieldChanged: createFormFieldChangedHandler,
  routeSelected: createRouteSelectedHandler,
  chainPinned: createChainPinnedHandler,
};

export const composeWidgetTrackingHandlers = (
  config: WidgetEventTrackerConfig,
  ctx: HandlerContext,
): WidgetEventsConfig =>
  Object.entries(config).reduce<WidgetEventsConfig>(
    (handlers, [key, eventConfig]) => {
      if (!eventConfig) {
        return handlers;
      }

      const factory = HANDLER_REGISTRY[key as keyof WidgetEventTrackerConfig];
      if (!factory) {
        return handlers;
      }

      return {
        ...handlers,
        ...factory(eventConfig, ctx),
      };
    },
    {},
  );
