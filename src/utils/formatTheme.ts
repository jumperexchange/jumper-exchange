import { STRAPI_PARTNER_THEMES } from '@/const/strapiContentKeys';
import { getStrapiUrl } from '@/hooks/useStrapi';
import type { PartnerThemeConfig } from '@/types/PartnerThemeConfig';
import type { PartnerThemesAttributes } from '@/types/strapi';

function getImageUrl(
  theme: PartnerThemesAttributes,
  imageType: 'BackgroundImage' | 'FooterImage' | 'Logo',
  defaultMode: 'light' | 'dark' = 'dark',
): URL | null {
  const baseStrapiUrl = getStrapiUrl(STRAPI_PARTNER_THEMES);

  const imageLight = theme[`${imageType}Light`];
  const imageDark = theme[`${imageType}Dark`];
  const imageUrl = defaultMode === 'light' ? imageLight?.url : imageDark?.url;

  return imageUrl ? new URL(imageUrl, baseStrapiUrl) : null;
}

export function getAvailableThemeModes(
  theme?: PartnerThemesAttributes,
): string[] {
  const result: string[] = [];

  // Means it is default jumper theme
  if (!theme) {
    return ['light', 'dark'];
  }

  if ((theme.vars || theme).darkConfig) {
    result.push('dark');
  }
  if ((theme.vars || theme).lightConfig) {
    result.push('light');
  }

  return result;
}

function getLogoData(theme: PartnerThemesAttributes) {
  const baseStrapiUrl = getStrapiUrl(STRAPI_PARTNER_THEMES);
  const logo = (theme.vars || theme).LogoDark || (theme.vars || theme).LogoLight || null;

  if (!logo) {
    return;
  }

  const attr = logo;

  return {
    url: new URL(attr.url, baseStrapiUrl),
    width: attr.width,
    height: attr.height,
  };
}

export function formatConfig(
  theme?: PartnerThemesAttributes,
): Partial<PartnerThemeConfig> {
  if (!theme) {
    return {
      uid: 'default',
      availableThemeModes: getAvailableThemeModes(theme),
      hasThemeModeSwitch: true,
      hasBackgroundGradient: true,
    };
  }

  const defaultMode = isDarkOrLightThemeMode(theme);
  const result = {
    availableThemeModes: getAvailableThemeModes(theme),
    backgroundColor:
      (theme.vars || theme).BackgroundColorDark || (theme.vars || theme).BackgroundColorLight || null,
    backgroundImageUrl: getImageUrl(theme, 'BackgroundImage', defaultMode),
    footerImageUrl: getImageUrl(theme, 'FooterImage', defaultMode),
    logo: getLogoData(theme),
    partnerName: (theme.vars || theme).PartnerName,
    partnerUrl: (theme.vars || theme).PartnerURL,
    selectableInMenu: (theme.vars || theme).SelectableInMenu || false,
    createdAt: (theme.vars || theme).createdAt,
    uid: (theme.vars || theme).uid,
    hasThemeModeSwitch: false,
    hasBlurredNavigation:
      ((theme.vars || theme).lightConfig || (theme.vars || theme).darkConfig)?.customization
        ?.hasBlurredNavigation ?? false,
    hasBackgroundGradient:
      ((theme.vars || theme).lightConfig || (theme.vars || theme).darkConfig)?.customization
        ?.hasBackgroundGradient ?? false,
    integrator:
      ((theme.vars || theme).lightConfig || (theme.vars || theme).darkConfig)?.config?.integrator ?? undefined,
    fromChain:
      ((theme.vars || theme).lightConfig || (theme.vars || theme).darkConfig)?.config?.fromChain ?? undefined,
    toChain:
      ((theme.vars || theme).lightConfig || (theme.vars || theme).darkConfig)?.config?.toChain ?? undefined,
    toToken:
      ((theme.vars || theme).lightConfig || (theme.vars || theme).darkConfig)?.config?.toToken ?? undefined,
    fromToken:
      ((theme.vars || theme).lightConfig || (theme.vars || theme).darkConfig)?.config?.fromToken ?? undefined,
    hiddenUI:
      ((theme.vars || theme).lightConfig || (theme.vars || theme).darkConfig)?.config?.hiddenUI ?? undefined,
    variant:
      ((theme.vars || theme).lightConfig || (theme.vars || theme).darkConfig)?.config?.variant ?? undefined,
    chains:
      ((theme.vars || theme).lightConfig || (theme.vars || theme).darkConfig)?.config?.chains ?? undefined,
    allowedBridges: (theme.vars || theme).Bridges?.map((i) => i.key),
    allowedExchanges: (theme.vars || theme).Exchanges?.map((i) => i.key),
  };

  return result;
}

export function formatTheme(theme: PartnerThemesAttributes) {
  const config = formatConfig(theme);

  const formattedMUITheme = {
    // @ts-expect-error
    ...((theme.vars || theme).lightConfig || (theme.vars || theme).darkConfig).customization,
    components: {
      Background: {
        styleOverrides: {
          // functions cannot merged because of mui... I know it's bad :(
          root: {
            position: 'fixed',
            left: 0,
            bottom: 0,
            right: 0,
            top: 0,
            zIndex: -1,
            overflow: 'hidden',
            pointerEvents: 'none',
            ...(config.backgroundColor && {
              backgroundColor: config.backgroundColor,
            }),
            ...(config.backgroundImageUrl && {
              background: `url('${config.backgroundImageUrl}') ${config.backgroundColor ?? ''} no-repeat center center / cover`,
            }),
          },
        },
      },
    },
  };

  const formattedWidgetTheme =
    ((theme.vars || theme).lightConfig || (theme.vars || theme).darkConfig)?.config ?? {};

  return {
    config,
    activeMUITheme: formattedMUITheme,
    activeWidgetTheme: formattedWidgetTheme,
    themeName: (theme.vars || theme).uid,
  };
}

export const isDarkOrLightThemeMode = (theme: PartnerThemesAttributes) =>
  (theme.vars || theme).lightConfig ? 'light' : 'dark';
