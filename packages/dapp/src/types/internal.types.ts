import { ChainId } from '@lifi/types';
import { WidgetConfig, WidgetSubvariant } from '@lifi/widget';
import 'react-i18next';
import { MenuKeys } from '../const';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    allowObjectInHTMLChildren: true;
  }
}

interface RaleonProps {
  addPopup: (n: string, e: string) => void;
  enableMessages: (e: boolean) => void;
  enableQuests: (e: boolean) => void;
  generateRaleonId: () => string;
  pageVisited: (e: string) => void;
  registerEvent: (e: string, t: string, o: any, a?: string) => void;
  walletConnected: (e: string) => void;
  walletDisconnected: () => void;
}

declare global {
  interface Window {
    raleon: RaleonProps;
  }
}

export interface ShowConnectModalProps {
  show: boolean;
  promiseResolver?: Promise<any>;
}

export interface MenuItem {
  label: string;
  destination: string;
}

export type StarterVariantType = 'buy' | WidgetSubvariant;

export interface MenuListItem {
  label: string | unknown;
  triggerSubMenu?: MenuKeys;
  prefixIcon?: JSX.Element | string;
  suffixIcon?: JSX.Element | string;
  showMoreIcon?: boolean;
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
