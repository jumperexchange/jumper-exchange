import type { TrackingCategory } from '@/const/trackingKeys';
import type { Account } from '@/hooks/useAccounts';

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
  data?: { [key: string]: string | number | boolean | any };
  disableTrackingTool?: EventTrackingTool[];
  enableAddressable?: boolean;
  isConversion?: boolean;
}

export interface TrackTransactionProps {
  action: string;
  category: string;
  chain: number;
  value?: number;
  disableTrackingTool?: EventTrackingTool[];
  data: Record<string, unknown>;
  txhash: string;
}

type destinations =
  | 'discord-lifi'
  | 'lifi-explorer'
  | 'lifi-website'
  | 'docs-sc-audits'
  | 'lifi-github'
  | 'lifi-docs'
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

export interface TrackDisconnectWalletProps {
  account?: Account;
  data?: { [key: string]: string | number | boolean };
  disableTrackingTool?: EventTrackingTool[];
}
