import { ChainID } from '@arcxmoney/analytics';
import { WalletAccount } from './internal.types';

export enum EventTrackingTool {
  ARCx,
  GA,
  Hotjar,
  Raleon,
}

export interface InitTrackingProps {
  disableTrackingTool?: EventTrackingTool[];
}

export interface TrackEventProps {
  action: string;
  category: string;
  label?: string;
  data?: { [key: string]: string | number | boolean | any };
  disableTrackingTool?: EventTrackingTool[];
}

export interface TrackTransactionProps {
  action: string;
  category: string;
  chain: ChainID;
  disableTrackingTool?: EventTrackingTool[];
  data: Record<string, unknown>;
  transactionHash: string;
}

export interface trackPageloadProps {
  destination: string;
  source: string;
  data?: { [key: string]: string | number | boolean };
  pageload: boolean;
  disableTrackingTool?: EventTrackingTool[];
  url: string;
}

export interface TrackConnectWalletProps {
  account: WalletAccount;
  data?: { [key: string]: string | number | boolean };
  disableTrackingTool?: EventTrackingTool[];
  disconnect?: boolean;
}
export interface TrackAttributeProps {
  data?: { [key: string]: string | number | boolean };
  disableTrackingTool?: EventTrackingTool[];
}
