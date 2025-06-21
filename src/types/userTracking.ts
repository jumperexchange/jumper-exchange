import type { Route, TokenAmount } from '@lifi/sdk';
import type { TrackingEventParameter } from 'src/const/trackingKeys';
import type { JumperEventData } from 'src/hooks/useJumperTracking';

export enum EventTrackingTool {
  GA,
  JumperTracking,
}

export interface InitTrackingProps {
  disableTrackingTool?: EventTrackingTool[];
}

export interface TrackEventProps {
  action: string;
  category: string;
  label: string;
  value?: number;
  data?: JumperEventData;
  disableTrackingTool?: EventTrackingTool[];
  enableAddressable?: boolean;
  isConversion?: boolean;
}

export interface TrackTransactionDataProps {
  // Required properties (always present)
  [TrackingEventParameter.FromAmount]: string;
  [TrackingEventParameter.FromAmountUSD]: string;
  [TrackingEventParameter.FromChainId]: number;
  [TrackingEventParameter.FromToken]: string;
  [TrackingEventParameter.IsFinal]: boolean;
  [TrackingEventParameter.NbOfSteps]: number;
  [TrackingEventParameter.RouteId]: string;
  [TrackingEventParameter.Slippage]: number;
  [TrackingEventParameter.StepIds]: string;
  [TrackingEventParameter.Steps]: string;
  [TrackingEventParameter.Time]: number;
  [TrackingEventParameter.ToAmount]: string;
  [TrackingEventParameter.ToAmountFormatted]: string;
  [TrackingEventParameter.ToAmountMin]: string;
  [TrackingEventParameter.ToAmountUSD]: number;
  [TrackingEventParameter.ToChainId]: number;
  [TrackingEventParameter.ToToken]: string;
  [TrackingEventParameter.TransactionId]: string;
  [TrackingEventParameter.TransactionStatus]: string;
  [TrackingEventParameter.Type]: string;

  // Optional properties (conditionally present) - sorted alphabetically
  [TrackingEventParameter.Action]?: string;
  [TrackingEventParameter.ErrorCode]?: string;
  [TrackingEventParameter.ErrorMessage]?: string;
  [TrackingEventParameter.Exchange]?: string;
  [TrackingEventParameter.FeeCost]?: number;
  [TrackingEventParameter.FeeCostFormatted]?: string;
  [TrackingEventParameter.FeeCostUSD]?: number;
  [TrackingEventParameter.GasCost]?: number;
  [TrackingEventParameter.GasCostFormatted]?: string;
  [TrackingEventParameter.GasCostUSD]?: number;
  [TrackingEventParameter.Integrator]?: string;
  [TrackingEventParameter.LastStepAction]?: string;
  [TrackingEventParameter.Message]?: string;
  [TrackingEventParameter.Status]?: string;
  [TrackingEventParameter.Tags]?: string;
  [TrackingEventParameter.TransactionHash]?: string;
  [TrackingEventParameter.TransactionLink]?: string;
}

export interface TrackTransactionProps {
  action: string;
  category: string;
  label: string;
  disableTrackingTool?: EventTrackingTool[];
  enableAddressable?: boolean;
  data: TrackTransactionDataProps;
  isConversion?: boolean;
}

export interface TokenSearchProps {
  value: string;
  tokens: TokenAmount[];
}

export interface RouteSelectedProps {
  route: Route;
  routes: Route[];
}
