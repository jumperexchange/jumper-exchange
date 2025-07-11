import type { ChainId } from '@lifi/sdk';
import type { WidgetConfig, WidgetSubvariant } from '@lifi/widget';
import type { SxProps, Theme } from '@mui/material';
import type { MenuItemLinkType } from 'src/components/Menu';
import type { MenuKeysEnum } from 'src/const/menuKeys';
import type { TrackingEventParameter } from 'src/const/trackingKeys';

declare global {
  interface Window {
    gtag: Gtag.Gtag;
    __adrsbl: {
      queue: any[];
      run: (
        event_name: string,
        is_conversion: boolean,
        properties: { name: string; value: any }[],
      ) => void;
    };
  }
}

export type StarterVariantType = 'buy' | WidgetSubvariant;

export interface MenuListItem {
  label: string;
  triggerSubMenu?: MenuKeysEnum;
  prefixIcon?: React.JSX.Element | string;
  suffixIcon?: React.JSX.Element | string;
  showMoreIcon?: boolean;
  styles?: SxProps<Theme>;
  checkIcon?: boolean;
  link?: MenuItemLinkType;
  onClick?: () => void;
  showButton?: boolean;
}

export interface ChainsMenuListItem {
  label: string;
  prefixIcon?: React.JSX.Element | string;
  showMoreIcon?: boolean;
  checkIcon?: boolean;
  onClick?: () => void;
  chainId: ChainId;
}

export interface ChainsMenuListItem {
  label: string;
  triggerSubMenu?: string;
  prefixIcon?: React.JSX.Element | string;
  suffixIcon?: React.JSX.Element | string;
  showMoreIcon?: boolean;
  checkIcon?: boolean;
  url?: string;
  onClick?: () => void;
  showButton?: boolean;
}

export type MultisigWidgetConfig = Pick<
  WidgetConfig,
  'fromChain' | 'requiredUI'
>;

export interface DataItem {
  logoURI?: string;
  name: string;
}
export interface TransformedRoute {
  [TrackingEventParameter.NbOfSteps]: number;
  [TrackingEventParameter.Steps]: object;
  [TrackingEventParameter.ToAmountUSD]: number;
  [TrackingEventParameter.GasCostUSD]: number | null;
  [TrackingEventParameter.Time]: number;
  [TrackingEventParameter.Slippage]: number;
}

/**
 * Represents an EVM-compatible hexadecimal address (0x-prefixed)
 * Used for fee recipient addresses and token contract addresses
 */
export type EVMAddress = `0x${string}`;
