import type { ChainId } from '@lifi/sdk';
import type { Address } from 'viem';
import type {
  TrackingAction,
  TrackingEventDataAction,
} from '@/const/trackingKeys';
import type { UserTracking } from '@/hooks/userTracking';
import type { WidgetTrackingSession } from '@/components/Widgets/tracking/WidgetTrackingSession';

export interface WidgetEventConfig {
  action: TrackingAction;
  label?: string;
  extraData?: Record<string, unknown>;
}

export interface RouteExecutionEventConfig extends WidgetEventConfig {
  dataAction: TrackingEventDataAction;
}

export interface WidgetEventTrackerConfig {
  availableRoutes?: WidgetEventConfig;
  sourceChainAndTokenSelection?: WidgetEventConfig;
  destinationChainAndTokenSelection?: WidgetEventConfig;
  changeSettings?: WidgetEventConfig;
  routeHighValueLoss?: WidgetEventConfig;
  lowAddressActivityConfirmed?: WidgetEventConfig;
  sendToWalletToggled?: WidgetEventConfig;
  formFieldChanged?: WidgetEventConfig;
  routeSelected?: WidgetEventConfig;
  chainPinned?: WidgetEventConfig;
  routeExecutionStarted?: RouteExecutionEventConfig;
  routeExecutionCompleted?: RouteExecutionEventConfig;
  routeExecutionFailed?: RouteExecutionEventConfig;
  routeExecutionUpdated?: RouteExecutionEventConfig;
}

export interface HandlerContext {
  tracking: UserTracking;
  session: WidgetTrackingSession;
  getToken: (
    chainId: ChainId,
    tokenAddress: Address,
  ) => { priceUSD?: string } | undefined;
}
