import type { TrackingEventParameter } from 'src/const/trackingKeys';

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
  data?: { [key: string]: string | number | boolean };
  disableTrackingTool?: EventTrackingTool[];
  enableAddressable?: boolean;
  isConversion?: boolean;
}

export interface TrackTransactionDataProps {
  [TrackingEventParameter.Type]?: string;
  [TrackingEventParameter.RouteId]?: string;
  [TrackingEventParameter.Status]?: string;
  [TrackingEventParameter.Action]?: string;
  [TrackingEventParameter.TransactionId]?: string;
  [TrackingEventParameter.TransactionHash]?: string;
  [TrackingEventParameter.TransactionLink]?: string;
  [TrackingEventParameter.FromChainId]?: number;
  [TrackingEventParameter.ToChainId]?: number;
  [TrackingEventParameter.Integrator]?: string;
  [TrackingEventParameter.TransactionStatus]?: string;
  [TrackingEventParameter.FromToken]?: string;
  [TrackingEventParameter.ToToken]?: string;
  [TrackingEventParameter.Exchange]?: string;
  [TrackingEventParameter.StepNumber]?: number;
  [TrackingEventParameter.TxHash]?: string;
  [TrackingEventParameter.IsFinal]?: boolean;
  [TrackingEventParameter.GasCost]?: number;
  [TrackingEventParameter.GasCostUSD]?: string;
  [TrackingEventParameter.FromAmount]?: string;
  [TrackingEventParameter.FromAmountUSD]?: string;
  [TrackingEventParameter.ToAmount]?: string;
  [TrackingEventParameter.ToAmountMin]?: string;
  [TrackingEventParameter.ToAmountUSD]?: string;
  [TrackingEventParameter.ErrorCode]?: string | number;
  [TrackingEventParameter.ErrorMessage]?: string;
  [TrackingEventParameter.Message]?: string;
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
