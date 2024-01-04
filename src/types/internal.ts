import type { ChainId } from '@lifi/sdk';
import type { WidgetConfig, WidgetSubvariant } from '@lifi/widget';
import type { CSSObject } from '@mui/material';
import 'react-i18next';
import type { MenuKeys } from 'src/const';
import type { Gtag } from './gtag';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    allowObjectInHTMLChildren: true;
  }
}

declare global {
  interface Window {
    gtag: Gtag.Gtag;
  }
}

export type StarterVariantType = 'buy' | WidgetSubvariant;

export interface MenuListItem {
  label: string;
  triggerSubMenu?: MenuKeys;
  prefixIcon?: JSX.Element | string;
  suffixIcon?: JSX.Element | string;
  showMoreIcon?: boolean;
  styles?: CSSObject;
  checkIcon?: boolean;
  url?: string;
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
