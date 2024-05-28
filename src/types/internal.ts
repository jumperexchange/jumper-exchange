import type { ChainId } from '@lifi/sdk';
import type { WidgetConfig, WidgetSubvariant } from '@lifi/widget';
import type { SxProps, Theme } from '@mui/material';
import type { MenuItemLinkType } from 'src/components/Menu';
import type { Gtag } from './gtag';
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

export type ThemeVariantType = 'memecoins';

export interface MenuListItem {
  label: string;
  triggerSubMenu?: any; //todo: proper typing
  prefixIcon?: JSX.Element | string;
  suffixIcon?: JSX.Element | string;
  showMoreIcon?: boolean;
  styles?: SxProps<Theme>;
  checkIcon?: boolean;
  link?: MenuItemLinkType;
  onClick?: any;
  showButton?: boolean;
}

export interface ChainsMenuListItem {
  label: string;
  prefixIcon?: JSX.Element | string;
  showMoreIcon?: boolean;
  checkIcon?: boolean;
  onClick?: any;
  chainId: ChainId;
}

export interface ChainsMenuListItem {
  label: string;
  triggerSubMenu?: string;
  prefixIcon?: JSX.Element | string;
  suffixIcon?: JSX.Element | string;
  showMoreIcon?: boolean;
  checkIcon?: boolean;
  url?: string;
  onClick?: any;
  showButton?: boolean;
}

export type MultisigWidgetConfig = Pick<
  WidgetConfig,
  'fromChain' | 'requiredUI'
>;

export type DataItem = {
  name: string;
};
