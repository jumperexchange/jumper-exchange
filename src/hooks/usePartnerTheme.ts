'use client';

import { useIsDapp } from '@/hooks/useIsDapp';
import { useStrapi } from '@/hooks/useStrapi';
import { useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { STRAPI_PARTNER_THEMES } from 'src/const/strapiContentKeys';
import { useSettingsStore } from 'src/stores/settings';
import type {
  MediaAttributes,
  PartnerTheme,
  PartnerThemesData,
} from 'src/types/strapi';
import { cleanThemeCustomization } from 'src/utils/transformToPalette';

interface usePartnerThemeProps {
  partnerTheme?: PartnerThemesData;
  backgroundColor?: string;
  currentCustomizedTheme?: any;
  footerImageUrl?: URL;
  footerUrl?: URL;
  availableThemeMode?: string;
  currentWidgetTheme?: PartnerTheme;
  logoUrl?: URL;
  logo?: MediaAttributes;
  activeUid?: string;
  imgUrl?: URL;
  isSuccess?: boolean;
  updateTheme: (themeUid?: string) => void;
}

const useFetchPartnerThemes = (queryKey: string) => {
  const { data, isSuccess, url } = useStrapi<PartnerThemesData>({
    contentType: STRAPI_PARTNER_THEMES,
    queryKey: ['partner-themes-filter', queryKey],
    filterUid: queryKey,
  });

  if (!data) {
    return { data: undefined, isSuccess: undefined, url: undefined };
  }
  const cleanedData = cleanThemeCustomization(data[0]);
  return {
    data: cleanedData,
    isSuccess,
    url,
  };
};

export const usePartnerTheme = (
  initialTheme?: PartnerThemesData,
): usePartnerThemeProps => {
  const theme = useTheme();
  const [activeTheme, setActiveTheme] = useState(initialTheme);
  const isDapp = useIsDapp();
  const [cookie, setCookie, removeCookie] = useCookies([
    'theme',
    'partnerThemeUid',
  ]);
  console.log('initialTheme', initialTheme);
  // const { partnerName } = usePartnerFilter();
  const setThemeMode = useSettingsStore((state) => state.setThemeMode);
  const {
    data: partnerThemes,
    isSuccess,
    url,
  } = useFetchPartnerThemes(cookie.partnerThemeUid);

  console.log('NOW', partnerThemes);
  useEffect(() => {
    if (partnerThemes) {
      // let updatedPartnerTheme = cleanThemeCustomization(partnerThemes);
      // console.log('TEST updatedPartnerThemes', updatedPartnerTheme);
      setActiveTheme(partnerThemes);
    }
  }, [activeTheme, cookie.partnerThemeUid, partnerThemes]);

  const updateTheme = (themeUid?: string) => {
    if (!themeUid) {
      removeCookie('partnerThemeUid', { path: '/' });
      return;
    }
    setCookie('partnerThemeUid', themeUid, {
      path: '/', // Cookie available across the entire website
      expires: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // Cookie expires in one month
      sameSite: true,
    });
  };

  let imageUrl: URL | undefined = undefined;
  if (
    partnerThemes &&
    (partnerThemes.attributes.BackgroundImageLight.data?.attributes.url ||
      partnerThemes.attributes.BackgroundImageDark.data?.attributes.url)
  ) {
    if (theme.palette.mode === 'light') {
      console.log('IMAGE LIGHT', partnerThemes.attributes.BackgroundImageLight);
      imageUrl = new URL(
        partnerThemes.attributes.BackgroundImageLight.data?.attributes.url,
        url.origin,
      );
    } else {
      console.log('IMAGE DARK', partnerThemes.attributes.BackgroundImageDark);

      imageUrl = new URL(
        partnerThemes.attributes.BackgroundImageDark.data?.attributes.url,
        url.origin,
      );
    }
  } else {
    imageUrl = undefined;
  }

  let footerImageUrl;
  if (
    cookie.partnerThemeUid &&
    partnerThemes &&
    isSuccess &&
    (partnerThemes.attributes.FooterImageLight.data?.attributes.url ||
      partnerThemes.attributes.FooterImageDark.data?.attributes.url)
  ) {
    if (theme.palette.mode === 'light') {
      footerImageUrl = new URL(
        partnerThemes.attributes.FooterImageLight.data?.attributes.url,
        url.origin,
      );
    } else {
      footerImageUrl = new URL(
        partnerThemes.attributes.FooterImageDark.data?.attributes.url,
        url.origin,
      );
    }
  } else {
    footerImageUrl = undefined;
  }

  let footerUrl;
  if (
    cookie.partnerThemeUid &&
    partnerThemes &&
    isSuccess &&
    partnerThemes.attributes.PartnerURL
  ) {
    footerUrl = new URL(partnerThemes.attributes.PartnerURL, url.origin);
  } else {
    footerImageUrl = undefined;
  }

  let logoUrl;
  let logo;
  if (
    cookie.partnerThemeUid &&
    partnerThemes &&
    isSuccess &&
    (partnerThemes.attributes.LogoLight.data?.attributes.url ||
      partnerThemes.attributes.LogoDark.data?.attributes.url)
  ) {
    if (theme.palette.mode === 'light') {
      logoUrl = new URL(
        partnerThemes.attributes.LogoLight.data?.attributes.url,
        url.origin,
      );
      logo = partnerThemes.attributes.LogoLight.data?.attributes;
    } else {
      logoUrl = new URL(
        partnerThemes.attributes.LogoDark.data?.attributes.url,
        url.origin,
      );
      logo = partnerThemes.attributes.LogoDark.data?.attributes;
    }
  } else {
    logoUrl = undefined;
  }

  let backgroundColor;
  if (cookie.partnerThemeUid && partnerThemes && isSuccess) {
    if (theme.palette.mode === 'light') {
      backgroundColor = partnerThemes.attributes.BackgroundColorLight;
    } else {
      backgroundColor = partnerThemes.attributes.BackgroundColorDark;
    }
  } else {
    backgroundColor = undefined;
  }
  console.log('GET backgroundColor', backgroundColor);

  let availableThemeMode;
  if (cookie.partnerThemeUid && partnerThemes && isSuccess) {
    if (
      partnerThemes.attributes.lightConfig &&
      partnerThemes.attributes.darkConfig
    ) {
      availableThemeMode = 'system';
    } else if (partnerThemes.attributes.darkConfig) {
      setThemeMode('dark');
      availableThemeMode = 'dark';
    } else {
      setThemeMode('light');
      availableThemeMode = 'light';
    }
  }

  let currentCustomizedTheme;
  let currentWidgetTheme;
  if (availableThemeMode === 'system') {
    if (theme.palette.mode === 'light') {
      currentWidgetTheme = partnerThemes?.attributes.lightConfig;
      currentCustomizedTheme =
        partnerThemes?.attributes.lightConfig?.customization;
    } else {
      currentWidgetTheme = partnerThemes?.attributes.darkConfig;
      currentCustomizedTheme =
        partnerThemes?.attributes.darkConfig?.customization;
    }
  } else if (availableThemeMode === 'dark') {
    currentWidgetTheme = partnerThemes?.attributes.darkConfig;
    currentCustomizedTheme =
      partnerThemes?.attributes.darkConfig?.customization;
  } else if (availableThemeMode === 'light') {
    currentWidgetTheme = partnerThemes?.attributes.lightConfig;
    currentCustomizedTheme =
      partnerThemes?.attributes.lightConfig?.customization;
  } else {
    currentWidgetTheme = undefined;
    currentCustomizedTheme = undefined;
  }

  console.log('activeTheme', activeTheme);
  console.log('CHECK2', isDapp ? backgroundColor : 'not dapp');
  return {
    partnerTheme: isDapp && partnerThemes ? activeTheme : undefined,
    backgroundColor: isDapp && backgroundColor ? backgroundColor : undefined,
    currentCustomizedTheme:
      isDapp && currentCustomizedTheme ? currentCustomizedTheme : undefined,
    footerImageUrl: isDapp && footerImageUrl ? footerImageUrl : undefined,
    footerUrl: isDapp && !!footerUrl ? new URL(footerUrl) : undefined,
    availableThemeMode:
      isDapp && availableThemeMode ? availableThemeMode : undefined,
    currentWidgetTheme:
      isDapp && currentWidgetTheme ? currentWidgetTheme : undefined,
    logoUrl: isDapp && logoUrl ? logoUrl : undefined,
    logo: isDapp && logo ? logo : undefined,
    activeUid: isDapp ? cookie.partnerThemeUid : undefined,
    imgUrl: isDapp && imageUrl ? imageUrl : undefined,
    isSuccess: isDapp && isSuccess,
    updateTheme,
  };
};
