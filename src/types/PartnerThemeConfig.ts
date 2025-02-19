import type { ChainId, WidgetChains, WidgetVariant } from '@lifi/widget';

export interface PartnerThemeConfig {
  availableThemeModes: string[];
  backgroundColor: string | null;
  backgroundImageUrl: URL | null;
  footerImageUrl: URL | null;
  logo:
    | {
        url: URL;
        width: number;
        height: number;
      }
    | undefined;
  partnerName: string;
  partnerUrl: URL | undefined;
  selectableInMenu: boolean;
  createdAt: string;
  uid: string;
  integrator?: string;
  fromChain?: ChainId;
  fromToken?: string;
  toToken?: string;
  toChain?: ChainId;
  chains?: WidgetChains;
  variant?: WidgetVariant;
  hiddentUI?: (
    | 'appearance'
    | 'toToken'
    | 'toAddress'
    | 'poweredBy'
    | 'language'
    | 'walletMenu'
    | 'drawerCloseButton'
    | 'history'
    | 'integratorStepDetails'
    | 'reverseTokensButton'
  )[];
  hasThemeModeSwitch: boolean;
  hasBackgroundGradient: boolean;
  hasBlurredNavigation: boolean;
  allowedBridges: string[];
  allowedExchanges: string[];
}
