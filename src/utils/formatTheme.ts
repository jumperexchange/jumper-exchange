import { STRAPI_PARTNER_THEMES } from '@/const/strapiContentKeys';
import { getStrapiUrl } from '@/hooks/useStrapi';
import type { PartnerThemeConfig } from '@/types/PartnerThemeConfig';
import type { PartnerThemesAttributes } from '@/types/strapi';

function getImageUrl(
  theme: PartnerThemesAttributes,
  imageType: 'BackgroundImage' | 'FooterImage' | 'Logo',
  defaultMode: 'light' | 'dark' = 'light',
): URL | null {
  const baseStrapiUrl = getStrapiUrl(STRAPI_PARTNER_THEMES);

  const imageLight = theme[`${imageType}Light`];
  const imageDark = theme[`${imageType}Dark`];
  const imageUrl =
    defaultMode === 'light'
      ? imageLight?.data?.attributes?.url
      : imageDark?.data?.attributes?.url;

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

  if (theme.darkConfig) {
    result.push('dark');
  }
  if (theme.lightConfig) {
    result.push('light');
  }

  return result;
}

function getLogoData(theme: PartnerThemesAttributes) {
  const baseStrapiUrl = getStrapiUrl(STRAPI_PARTNER_THEMES);
  const logo = theme.LogoDark || theme.LogoLight || null;

  if (!logo || !logo.data) {
    return;
  }

  const attr = logo.data.attributes;

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
      theme.BackgroundColorDark || theme.BackgroundColorLight || null,
    backgroundImageUrl: getImageUrl(theme, 'BackgroundImage', defaultMode),
    footerImageUrl: getImageUrl(theme, 'FooterImage', defaultMode),
    logo: getLogoData(theme),
    partnerName: theme.PartnerName,
    partnerUrl: theme.PartnerURL,
    selectableInMenu: theme.SelectableInMenu || false,
    createdAt: theme.createdAt,
    uid: theme.uid,
    hasThemeModeSwitch: false,
    hasBlurredNavigation:
      (theme.lightConfig || theme.darkConfig)?.customization
        ?.hasBlurredNavigation ?? false,
    hasBackgroundGradient:
      (theme.lightConfig || theme.darkConfig)?.customization
        ?.hasBackgroundGradient ?? false,
    integrator:
      (theme.lightConfig || theme.darkConfig)?.config?.integrator ?? undefined,
    fromChain:
      (theme.lightConfig || theme.darkConfig)?.config?.fromChain ?? undefined,
    toChain:
      (theme.lightConfig || theme.darkConfig)?.config?.toChain ?? undefined,
    toToken:
      (theme.lightConfig || theme.darkConfig)?.config?.toToken ?? undefined,
    fromToken:
      (theme.lightConfig || theme.darkConfig)?.config?.fromToken ?? undefined,
    variant:
      (theme.lightConfig || theme.darkConfig)?.config?.variant ?? undefined,
    chains:
      (theme.lightConfig || theme.darkConfig)?.config?.chains ?? undefined,
    allowedBridges: theme.Bridges?.map((i) => i.key),
    allowedExchanges: theme.Exchanges?.map((i) => i.key),
  };

  return result;
}

export function formatTheme(theme: PartnerThemesAttributes) {
  const config = formatConfig(theme);

  const formattedMUITheme = {
    // @ts-expect-error
    ...(theme.lightConfig || theme.darkConfig).customization,
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
    (theme.lightConfig || theme.darkConfig)?.config ?? {};

  return {
    config,
    activeMUITheme: formattedMUITheme,
    activeWidgetTheme: formattedWidgetTheme,
    themeName: theme.uid,
  };
}

export const isDarkOrLightThemeMode = (theme: PartnerThemesAttributes) =>
  theme.darkConfig ? 'dark' : 'light';
