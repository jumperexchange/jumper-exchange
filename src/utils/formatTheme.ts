import type { PartnerThemesAttributes } from '@/types/strapi';
import { getStrapiUrl } from '@/hooks/useStrapi';
import { STRAPI_PARTNER_THEMES } from '@/const/strapiContentKeys';

function getImageUrl(
  theme: PartnerThemesAttributes,
  imageType: 'BackgroundImage' | 'FooterImage' | 'Logo',
): URL | null {
  const baseStrapiUrl = getStrapiUrl(STRAPI_PARTNER_THEMES);

  const imageLight = theme[`${imageType}Light`];
  const imageDark = theme[`${imageType}Dark`];
  const imageUrl =
    imageLight?.data?.attributes.url || imageDark?.data?.attributes.url;

  return imageUrl ? new URL(imageUrl, baseStrapiUrl) : null;
}

export function getAvailableThemeMode(theme: PartnerThemesAttributes) {
  if (!theme) {
    return 'light';
  }

  return theme.darkConfig ? (theme.lightConfig ? 'auto' : 'dark') : 'light';
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

export function formatConfig(theme: PartnerThemesAttributes) {
  if (!theme) {
    return {
      uid: 'default',
      availableThemeMode: getAvailableThemeMode(theme),
      hasThemeModeSwitch: true,
      hasBackgroundGradient: true,
    };
  }

  return {
    availableThemeMode: getAvailableThemeMode(theme),
    backgroundColor:
      theme.BackgroundColorDark || theme.BackgroundColorLight || null,
    backgroundImageUrl: getImageUrl(theme, 'BackgroundImage'),
    footerImageUrl: getImageUrl(theme, 'FooterImage'),
    logo: getLogoData(theme),
    partnerName: theme.PartnerName,
    partnerUrl: theme.PartnerURL,
    selectableInMenu: theme.SelectableInMenu,
    createdAt: theme.createdAt,
    uid: theme.uid,
    hasThemeModeSwitch: false,
    hasBackgroundGradient: false,
    allowedBridges: theme.Bridges?.map((i) => i.key),
    allowedExchanges: theme.Exchanges?.map((i) => i.key),
  };
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

            // background: '#000000',
            // backgroundColor: 'red',
            ...(config.backgroundColor && {
              backgroundColor: config.backgroundColor,
            }),
            ...(config.backgroundImageUrl && {
              background: `url('${config.backgroundImageUrl}')`,
            }),
          },
        },
      },
    },
  };

  const formattedWidgetTheme =
    (theme.lightConfig || theme.darkConfig)?.config ?? {};

  // console.log('TEST', { config, activeMUITheme: formattedMUITheme, activeWidgetTheme: formattedWidgetTheme, themeName: theme.uid })

  return {
    config,
    activeMUITheme: formattedMUITheme,
    activeWidgetTheme: formattedWidgetTheme,
    themeName: theme.uid,
  };
}
