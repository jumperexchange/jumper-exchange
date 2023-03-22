import { ChainID } from '@arcxmoney/analytics';
import { WalletAccount } from '../../types';

export enum EventTrackingTools {
  arcx,
  ga,
  hotjar,
}

export interface InitTrackingProps {
  disableTrackingTool?: EventTrackingTools[];
}

export interface TrackEventProps {
  action: string;
  category: string;
  label?: string;
  data?: { [key: string]: string | number | boolean | any };
  disableTrackingTool?: EventTrackingTools[];
}

export interface TrackTransactionProps {
  action: string;
  category: string;
  chain: ChainID;
  disableTrackingTool?: EventTrackingTools[];
  data: Record<string, unknown>;
  transactionHash: string;
}

export interface trackPageloadProps {
  destination: string;
  source: string;
  data?: { [key: string]: string | number | boolean };
  pageload: boolean;
  disableTrackingTool?: EventTrackingTools[];
  url: string;
}

export interface TrackConnectWalletProps {
  account: WalletAccount;
  data?: { [key: string]: string | number | boolean };
  disableTrackingTool?: EventTrackingTools[];
  disconnect?: boolean;
}
export interface TrackAttributeProps {
  data?: { [key: string]: string | number | boolean };
  disableTrackingTool?: EventTrackingTools[];
}
