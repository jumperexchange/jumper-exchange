'use client';

import { getStrapiUrl, useStrapi } from '@/hooks/useStrapi';
import { useCookies } from 'react-cookie';
import { STRAPI_PARTNER_THEMES } from 'src/const/strapiContentKeys';
import { useSettingsStore } from 'src/stores/settings';
import type {
  PartnerThemesAttributes,
  PartnerThemesData,
} from 'src/types/strapi';
import { useEffect } from 'react';
import type { ThemeModesSupported } from '@/types/settings';
import { useThemeMode } from '@/hooks/useThemeMode';

const defaultResponse = { data: undefined, isSuccess: false, url: undefined };

const useFetchPartnerThemes = (queryKey: string) => {
  const { data, isSuccess, url } = useStrapi<PartnerThemesData>({
    contentType: STRAPI_PARTNER_THEMES,
    queryKey: ['partner-themes-filter', queryKey],
    filterUid: queryKey,
  });

  if (!data) {
    return defaultResponse;
  }
  return {
    data: data[0],
    isSuccess,
    url,
  };
};

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

  // @ts-expect-error
  const formattedWidgetTheme = (theme.lightConfig || theme.darkConfig).config
    .theme;

  // console.log('TEST', { config, activeMUITheme: formattedMUITheme, activeWidgetTheme: formattedWidgetTheme, themeName: theme.uid })

  return {
    config,
    activeMUITheme: formattedMUITheme,
    activeWidgetTheme: formattedWidgetTheme,
    themeName: theme.uid,
  };
}

export const usePartnerThemeV2 = (
  overrideThemeKey?: string,
  // overrideTheme?: PartnerThemesAttributes,
) => {
  // const [activeTheme, setActiveTheme] = useState(initialTheme);
  const [cookie, setCookie, removeCookie] = useCookies([
    'partnerThemeUid',
    'themeMode',
    'theme',
  ]);
  // console.log('overrideTheme', overrideThemeKey, cookie);
  const { themeMode, setThemeMode } = useThemeMode();
  const [activeTheme, setActiveTheme] = useSettingsStore((state) => [
    state.activeTheme,
    state.setActiveTheme,
  ]);

  const { data, isSuccess, url } = useFetchPartnerThemes(
    activeTheme || overrideThemeKey,
  );

  const updateActiveTheme = (themeUid?: string) => {
    setActiveTheme(themeUid);
    if (themeUid) {
      setCookie('partnerThemeUid', themeUid, {
        path: '/', // Cookie available across the entire website
        expires: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // Cookie expires in one month
        sameSite: true,
      });
      setCookie('theme', themeUid, {
        path: '/', // Cookie available across the entire website
        expires: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // Cookie expires in one month
        sameSite: true,
      });
    } else {
      removeCookie('partnerThemeUid');
    }
  };

  const updateThemeMode = (themeMode?: ThemeModesSupported) => {
    if (themeMode) {
      setThemeMode(themeMode);
      setCookie('themeMode', themeMode, {
        path: '/', // Cookie available across the entire website
        expires: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // Cookie expires in one month
        sameSite: true,
      });
    } else {
      removeCookie('themeMode');
    }
  };

  useEffect(() => {
    if (!overrideThemeKey) {
      return;
    }

    updateActiveTheme(overrideThemeKey);

    // updateThemeMode(getAvailableThemeMode(overrideTheme));
  }, []);

  // console.log('intdsoihgoefrdhgoigfsh', data, isSuccess, url, data && formatTheme(url!, data.attributes));
  // console.log('as---daw---', overrideThemeKey, data, activeTheme)

  const result = {
    setActiveTheme: updateActiveTheme,
    setActiveThemeMode: updateThemeMode,
    activeThemeMode: themeMode,
    activeThemeKey: activeTheme || undefined,
    activeTheme: data || undefined,
  };

  // console.log('JUST BEFORE IFF', activeTheme, data)

  /*  if (overrideTheme) {
    console.log('sss===sss', formatTheme(overrideTheme), result, {
      ...result,
      ...formatTheme(overrideTheme)
    });

    return {
      ...result,
      ...formatTheme(overrideTheme)
    };
  }*/

  if (data) {
    return {
      ...result,
      ...formatTheme(data.attributes),
    };
  }

  return result;
};
