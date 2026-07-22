import type {
  ChainId,
  HiddenUIConfig,
  WidgetChains,
  WidgetVariant,
} from '@jumperexchange/widget';

export interface PartnerThemeConfig {
  themeModeIcon?: string;
  defaultThemeMode: 'light' | 'dark';
  availableThemeModes: string[];
  backgroundColor: string | null;
  backgroundImageUrl: URL | null;
  backgroundImageMime: string | null;
  backgroundImagePosition: string;
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
  publishedAt?: string;
  uid: string;
  integrator?: string;
  fromChain?: ChainId;
  fromToken?: string;
  toToken?: string;
  toChain?: ChainId;
  chains?: WidgetChains;
  variant?: WidgetVariant;
  hiddenUI?: HiddenUIConfig;
  hasThemeModeSwitch: boolean;
  hasBackgroundGradient: boolean;
  hasBlurredNavigation: boolean;
  canvasBackground: { id: string; options: Record<string, unknown> } | null;
  allowedBridges: string[];
  allowedExchanges: string[];
  allowFeatureCardBackground: boolean;
}
