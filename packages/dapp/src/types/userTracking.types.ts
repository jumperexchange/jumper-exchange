import { ChainID } from '@arcxmoney/analytics';
import { WalletAccount } from '@transferto/shared/src/types';

export enum EventTrackingTool {
  ARCx,
  GA,
  Hotjar,
  Cookie3,
}

export interface InitTrackingProps {
  disableTrackingTool?: EventTrackingTool[];
}

export interface TrackEventProps {
  action: string;
  category: string;
  label: string;
  value?: number;
  data?: { [key: string]: string | number | boolean | any };
  disableTrackingTool?: EventTrackingTool[];
}

export interface TrackTransactionProps {
  action: string;
  category: string;
  chain: ChainID;
  value?: number;
  disableTrackingTool?: EventTrackingTool[];
  data: Record<string, unknown>;
  txhash: string;
}
export interface TrackChainSwitchProps {
  account?: WalletAccount;
  disableTrackingTool?: EventTrackingTool[];
  action: string;
  category?: string;
  label?: string;
  value?: number;
  data?: { [key: string]: string | number | boolean | any };
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
  account?: WalletAccount;
  data?: { [key: string]: string | number | boolean };
  disableTrackingTool?: EventTrackingTool[];
  disconnect?: boolean;
}

export interface TrackDisconnectWalletProps {
  account?: WalletAccount;
  data?: { [key: string]: string | number | boolean };
  disableTrackingTool?: EventTrackingTool[];
}
export interface TrackAttributeProps {
  data?: { [key: string]: string | number | boolean };
  disableTrackingTool?: EventTrackingTool[];
}
