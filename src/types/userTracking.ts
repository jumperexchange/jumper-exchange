import type { ChainType } from '@lifi/sdk';
import type { TrackingCategory } from 'src/const/trackingKeys';
import type { Account } from 'src/hooks/useAccounts';

export enum EventTrackingTool {
  GA,
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

type destinations =
  | 'discord-jumper'
  | 'jumper-explorer'
  | 'jumper-scan'
  | 'jumper-scan-wallet'
  | 'jumper-website'
  | 'docs-sc-audits'
  | 'jumper-github'
  | 'jumper-docs'
  | 'x-jumper'
  | 'blokchain-explorer';

type source = TrackingCategory;

export interface trackPageloadProps {
  destination: destinations;
  source: source;
  data?: { [key: string]: string | number | boolean };
  pageload: boolean;
  disableTrackingTool?: EventTrackingTool[];
  url: string;
}

export interface TrackConnectWalletProps {
  account?: Account;
  walletName?: string;
  chainType?: ChainType;
  chainId: number;
  address?: string;
}

export interface TrackDisconnectWalletProps {
  account?: Account;
  data?: { [key: string]: string | number | boolean };
  disableTrackingTool?: EventTrackingTool[];
}
export interface TrackAttributeProps {
  data?: { [key: string]: string | number | boolean };
  disableTrackingTool?: EventTrackingTool[];
}
