import { ChainID } from '@arcxmoney/analytics';
import { ChainId } from '@lifi/types';
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
export interface TrackChainSwitchProps  {
  chainId: ChainId;
  account?: WalletAccount | { address: string }; 
  disableTrackingTool?: EventTrackingTool[]; 
};

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
  data?: { [key: string]: string | number | boolean };
  disableTrackingTool?: EventTrackingTool[];
}
export interface TrackAttributeProps {
  data?: { [key: string]: string | number | boolean };
  disableTrackingTool?: EventTrackingTool[];
}
