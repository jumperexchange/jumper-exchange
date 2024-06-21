'use client';

import { useTheme } from '@mui/material';
import { useMemo } from 'react';
import { STRAPI_PARTNER_THEMES } from 'src/const/strapiContentKeys';
import { useSettingsStore } from 'src/stores/settings';
import type { PartnerThemesData } from 'src/types/strapi';
import { shallow } from 'zustand/shallow';
import { useIsHomepage } from './useIsHomepage';
import { useStrapi } from './useStrapi';

export const usePartnerTheme = () => {
  const theme = useTheme();
  const isHomepage = useIsHomepage();
  const setThemeMode = useSettingsStore((state) => state.setThemeMode);
  const partnerThemeUid = useSettingsStore(
    (state) => state.partnerThemeUid,
    shallow,
  );
  const {
    data: partnerThemes,
    isSuccess,
    url,
  } = useStrapi<PartnerThemesData>({
    contentType: STRAPI_PARTNER_THEMES,
    queryKey: ['partner-themes-filter', partnerThemeUid],
    filterUid: partnerThemeUid,
  });

  const imageUrl = useMemo(() => {
    if (
      partnerThemeUid &&
      partnerThemes?.length > 0 &&
      isSuccess &&
      (partnerThemes[0].attributes.BackgroundImageLight.data?.attributes.url ||
        partnerThemes[0].attributes.BackgroundImageDark.data?.attributes.url)
    ) {
      return theme.palette.mode === 'light'
        ? new URL(
            partnerThemes[0].attributes.BackgroundImageLight.data?.attributes.url,
            url.origin,
          )
        : new URL(
            partnerThemes[0].attributes.BackgroundImageDark.data?.attributes.url,
            url.origin,
          );
    } else {
      return undefined;
    }
  }, [
    partnerThemeUid,
    partnerThemes,
    isSuccess,
    theme.palette.mode,
    url.origin,
  ]);

  const footerImageUrl = useMemo(() => {
    if (
      partnerThemeUid &&
      partnerThemes?.length > 0 &&
      isSuccess &&
      (partnerThemes[0].attributes.FooterImageLight.data?.attributes.url ||
        partnerThemes[0].attributes.FooterImageDark.data?.attributes.url)
    ) {
      return theme.palette.mode === 'light'
        ? new URL(
            partnerThemes[0].attributes.FooterImageLight.data?.attributes.url,
            url.origin,
          )
        : new URL(
            partnerThemes[0].attributes.FooterImageDark.data?.attributes.url,
            url.origin,
          );
    } else {
      return undefined;
    }
  }, [
    isSuccess,
    partnerThemeUid,
    partnerThemes,
    theme.palette.mode,
    url.origin,
  ]);

  const logoUrl = useMemo(() => {
    if (
      partnerThemeUid &&
      partnerThemes?.length > 0 &&
      isSuccess &&
      (partnerThemes[0].attributes.LogoLight.data?.attributes.url ||
        partnerThemes[0].attributes.LogoDark.data?.attributes.url)
    ) {
      return theme.palette.mode === 'light'
        ? new URL(
            partnerThemes[0].attributes.LogoLight.data?.attributes.url,
            url.origin,
          )
        : new URL(
            partnerThemes[0].attributes.LogoDark.data?.attributes.url,
            url.origin,
          );
    } else {
      return undefined;
    }
  }, [
    isSuccess,
    partnerThemeUid,
    partnerThemes,
    theme.palette.mode,
    url.origin,
  ]);

  const backgroundColor = useMemo(() => {
    if (partnerThemeUid && partnerThemes?.length > 0 && isSuccess) {
      return theme.palette.mode === 'light'
        ? partnerThemes[0].attributes.BackgroundColorLight
        : partnerThemes[0].attributes.BackgroundColorDark;
    } else {
      return undefined;
    }
  }, [isSuccess, partnerThemeUid, partnerThemes, theme.palette.mode]);

  const availableWidgetTheme = useMemo(() => {
    if (partnerThemeUid && partnerThemes?.length > 0 && isSuccess) {
      if (
        partnerThemes[0].attributes.lightConfig &&
        partnerThemes[0].attributes.darkConfig
      ) {
        return 'system';
      } else if (partnerThemes[0].attributes.darkConfig) {
        setThemeMode('dark');
        return 'dark';
      } else {
        setThemeMode('light');
        return 'light';
      }
    }
  }, [isSuccess, partnerThemeUid, partnerThemes, setThemeMode]);

  const currentWidgetTheme = useMemo(() => {
    if (availableWidgetTheme === 'system') {
      return theme.palette.mode === 'light'
        ? partnerThemes[0].attributes.lightConfig?.widgetTheme
        : partnerThemes[0].attributes.darkConfig?.widgetTheme;
    } else if (availableWidgetTheme === 'dark') {
      return partnerThemes[0].attributes.darkConfig?.widgetTheme;
    } else if (availableWidgetTheme === 'light') {
      return partnerThemes[0].attributes.lightConfig?.widgetTheme;
    } else {
      return undefined;
    }
  }, [availableWidgetTheme, partnerThemes, theme.palette.mode]);

  const currentCustomizedTheme = useMemo(() => {
    if (availableWidgetTheme === 'system') {
      return theme.palette.mode === 'light'
        ? partnerThemes[0].attributes.lightConfig?.customization
        : partnerThemes[0].attributes.darkConfig?.customization;
    } else if (availableWidgetTheme === 'dark') {
      return partnerThemes[0].attributes.darkConfig?.customization;
    } else if (availableWidgetTheme === 'light') {
      return partnerThemes[0].attributes.lightConfig?.customization;
    } else {
      return undefined;
    }
  }, [availableWidgetTheme, partnerThemes, theme.palette.mode]);

  return {
    partnerTheme:
      isHomepage && partnerThemes?.length > 0 ? partnerThemes[0] : undefined,
    backgroundColor:
      isHomepage && backgroundColor ? backgroundColor : undefined,
    currentCustomizedTheme:
      isHomepage && currentCustomizedTheme ? currentCustomizedTheme : undefined,
    footerImageUrl: isHomepage && footerImageUrl ? footerImageUrl : undefined,
    availableWidgetTheme:
      isHomepage && availableWidgetTheme ? availableWidgetTheme : undefined,
    currentWidgetTheme:
      isHomepage && currentWidgetTheme ? currentWidgetTheme : undefined,
    logoUrl: isHomepage && logoUrl ? logoUrl : undefined,
    activeUid: isHomepage && partnerThemeUid ? partnerThemeUid : undefined,
    imgUrl: isHomepage && imageUrl ? imageUrl : undefined,
    isSuccess: isHomepage && isSuccess,
  };
};
