import type { ChainId } from '@lifi/types';
import type { WidgetConfig, WidgetSubvariant } from '@lifi/widget';
import type { SxProps, Theme } from '@mui/material';
import type { MenuItemLinkType } from 'src/components/Menu';
import type { MenuKeysEnum } from 'src/const/menuKeys';

declare global {
  interface Window {
    gtag: Gtag.Gtag;
    __adrsbl: {
      queue: any[];
      run: (
        event_name: string,
        is_conversion: boolean,
        properties: { name: string; value: unknown }[],
      ) => void;
    };
  }
}

export type StarterVariantType = 'buy' | WidgetSubvariant;

export interface MenuListItem {
  label: string;
  triggerSubMenu?: MenuKeysEnum;
  prefixIcon?: JSX.Element | string;
  suffixIcon?: JSX.Element | string;
  showMoreIcon?: boolean;
  styles?: SxProps<Theme>;
  checkIcon?: boolean;
  link?: MenuItemLinkType;
  onClick?: () => void;
  showButton?: boolean;
}

export interface ChainsMenuListItem {
  label: string;
  prefixIcon?: JSX.Element | string;
  showMoreIcon?: boolean;
  checkIcon?: boolean;
  onClick?: () => void;
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
