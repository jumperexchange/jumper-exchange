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
  hasThemeModeSwitch: boolean;
  hasBackgroundGradient: boolean;
  hasBlurredNavigation: boolean;
  allowedBridges: string[];
  allowedExchanges: string[];
}
