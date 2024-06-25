'use client';

import { useIsDapp } from '@/hooks/useIsDapp';
import { useStrapi } from '@/hooks/useStrapi';
import type { WidgetTheme } from '@lifi/widget';
import { useTheme } from '@mui/material';
import { STRAPI_PARTNER_THEMES } from 'src/const/strapiContentKeys';
import { useSettingsStore } from 'src/stores/settings';
import type { PartnerThemesData } from 'src/types/strapi';
import { shallow } from 'zustand/shallow';

interface usePartnerThemeProps {
  partnerTheme?: PartnerThemesData;
  backgroundColor?: string;
  currentCustomizedTheme?: any;
  footerImageUrl?: URL;
  availableWidgetTheme?: string;
  currentWidgetTheme?: WidgetTheme;
  logoUrl?: URL;
  activeUid?: string;
  imgUrl?: URL;
  isSuccess?: boolean;
}

export const usePartnerTheme = (): usePartnerThemeProps => {
  const theme = useTheme();
  const isDapp = useIsDapp();
  const [partnerThemeUid, partnerPageThemeUid, setThemeMode] = useSettingsStore(
    (state) => [
      state.partnerThemeUid,
      state.partnerPageThemeUid,
      state.setThemeMode,
    ],
    shallow,
  );

  const {
    data: partnerThemes,
    isSuccess,
    url,
  } = useStrapi<PartnerThemesData>({
    contentType: STRAPI_PARTNER_THEMES,
    queryKey: ['partner-themes-filter', partnerPageThemeUid || partnerThemeUid],
    filterUid: partnerPageThemeUid || partnerThemeUid,
  });

  let imageUrl: URL | undefined = undefined;
  if (
    (partnerPageThemeUid || partnerThemeUid) &&
    partnerThemes?.length > 0 &&
    isSuccess &&
    (partnerThemes[0].attributes.BackgroundImageLight.data?.attributes.url ||
      partnerThemes[0].attributes.BackgroundImageDark.data?.attributes.url)
  ) {
    if (theme.palette.mode === 'light') {
      imageUrl = new URL(
        partnerThemes[0].attributes.BackgroundImageLight.data?.attributes.url,
        url.origin,
      );
    } else {
      imageUrl = new URL(
        partnerThemes[0].attributes.BackgroundImageDark.data?.attributes.url,
        url.origin,
      );
    }
  } else {
    imageUrl = undefined;
  }

  let footerImageUrl;
  if (
    (partnerPageThemeUid || partnerThemeUid) &&
    partnerThemes?.length > 0 &&
    isSuccess &&
    (partnerThemes[0].attributes.FooterImageLight.data?.attributes.url ||
      partnerThemes[0].attributes.FooterImageDark.data?.attributes.url)
  ) {
    if (theme.palette.mode === 'light') {
      footerImageUrl = new URL(
        partnerThemes[0].attributes.FooterImageLight.data?.attributes.url,
        url.origin,
      );
    } else {
      footerImageUrl = new URL(
        partnerThemes[0].attributes.FooterImageDark.data?.attributes.url,
        url.origin,
      );
    }
  } else {
    footerImageUrl = undefined;
  }

  let logoUrl;
  if (
    (partnerPageThemeUid || partnerThemeUid) &&
    partnerThemes?.length > 0 &&
    isSuccess &&
    (partnerThemes[0].attributes.LogoLight.data?.attributes.url ||
      partnerThemes[0].attributes.LogoDark.data?.attributes.url)
  ) {
    if (theme.palette.mode === 'light') {
      logoUrl = new URL(
        partnerThemes[0].attributes.LogoLight.data?.attributes.url,
        url.origin,
      );
    } else {
      logoUrl = new URL(
        partnerThemes[0].attributes.LogoDark.data?.attributes.url,
        url.origin,
      );
    }
  } else {
    logoUrl = undefined;
  }

  let backgroundColor;
  if (
    (partnerPageThemeUid || partnerThemeUid) &&
    partnerThemes?.length > 0 &&
    isSuccess
  ) {
    if (theme.palette.mode === 'light') {
      backgroundColor = partnerThemes[0].attributes.BackgroundColorLight;
    } else {
      backgroundColor = partnerThemes[0].attributes.BackgroundColorDark;
    }
  } else {
    backgroundColor = undefined;
  }

  let availableWidgetTheme;
  if (
    (partnerPageThemeUid || partnerThemeUid) &&
    partnerThemes?.length > 0 &&
    isSuccess
  ) {
    if (
      partnerThemes[0].attributes.lightConfig &&
      partnerThemes[0].attributes.darkConfig
    ) {
      availableWidgetTheme = 'system';
    } else if (partnerThemes[0].attributes.darkConfig) {
      setThemeMode('dark');
      availableWidgetTheme = 'dark';
    } else {
      setThemeMode('light');
      availableWidgetTheme = 'light';
    }
  }

  let currentWidgetTheme;
  if (availableWidgetTheme === 'system') {
    if (theme.palette.mode === 'light') {
      currentWidgetTheme = partnerThemes[0].attributes.lightConfig?.widgetTheme;
    } else {
      currentWidgetTheme = partnerThemes[0].attributes.darkConfig?.widgetTheme;
    }
  } else if (availableWidgetTheme === 'dark') {
    currentWidgetTheme = partnerThemes[0].attributes.darkConfig?.widgetTheme;
  } else if (availableWidgetTheme === 'light') {
    currentWidgetTheme = partnerThemes[0].attributes.lightConfig?.widgetTheme;
  } else {
    currentWidgetTheme = undefined;
  }

  let currentCustomizedTheme;
  if (availableWidgetTheme === 'system') {
    if (theme.palette.mode === 'light') {
      currentCustomizedTheme =
        partnerThemes[0].attributes.lightConfig?.customization;
    } else {
      currentCustomizedTheme =
        partnerThemes[0].attributes.darkConfig?.customization;
    }
  } else if (availableWidgetTheme === 'dark') {
    currentCustomizedTheme =
      partnerThemes[0].attributes.darkConfig?.customization;
  } else if (availableWidgetTheme === 'light') {
    currentCustomizedTheme =
      partnerThemes[0].attributes.lightConfig?.customization;
  } else {
    currentCustomizedTheme = undefined;
  }

  return {
    partnerTheme:
      isDapp && partnerThemes?.length > 0 ? partnerThemes[0] : undefined,
    backgroundColor: isDapp && backgroundColor ? backgroundColor : undefined,
    currentCustomizedTheme:
      isDapp && currentCustomizedTheme ? currentCustomizedTheme : undefined,
    footerImageUrl: isDapp && footerImageUrl ? footerImageUrl : undefined,
    availableWidgetTheme:
      isDapp && availableWidgetTheme ? availableWidgetTheme : undefined,
    currentWidgetTheme:
      isDapp && currentWidgetTheme ? currentWidgetTheme : undefined,
    logoUrl: isDapp && logoUrl ? logoUrl : undefined,
    activeUid:
      (isDapp && partnerPageThemeUid) ||
      (isDapp && partnerThemeUid) ||
      undefined,
    imgUrl: isDapp && imageUrl ? imageUrl : undefined,
    isSuccess: isDapp && isSuccess,
  };
};
