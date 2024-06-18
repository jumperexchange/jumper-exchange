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
    queryKey: ['partner-themes'],
    filterUid: partnerThemeUid,
  });

  const imageUrl = useMemo(() => {
    if (partnerThemeUid && partnerThemes?.length > 0 && isSuccess) {
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

  const availableWidgetTheme = useMemo(() => {
    if (partnerThemeUid && partnerThemes?.length > 0 && isSuccess) {
      if (
        partnerThemes[0].attributes.lightConfig &&
        partnerThemes[0].attributes.darkConfig
      ) {
        return 'system';
      } else if (partnerThemes[0].attributes.darkConfig) {
        return 'dark';
      } else {
        return 'light';
      }
    }
  }, [isSuccess, partnerThemeUid, partnerThemes]);

  const currentWidgetTheme = useMemo(() => {
    if (availableWidgetTheme === 'system') {
      return theme.palette.mode === 'light'
        ? partnerThemes[0].attributes.lightConfig
        : partnerThemes[0].attributes.darkConfig;
    } else if (availableWidgetTheme === 'dark') {
      return partnerThemes[0].attributes.darkConfig;
    } else if (availableWidgetTheme === 'light') {
      return partnerThemes[0].attributes.lightConfig;
    } else {
      return undefined;
    }
  }, [availableWidgetTheme, partnerThemes, theme.palette.mode]);

  return {
    partnerTheme:
      isHomepage && partnerThemes?.length > 0 ? partnerThemes[0] : undefined,
    availableWidgetTheme:
      isHomepage && availableWidgetTheme ? availableWidgetTheme : undefined,
    currentWidgetTheme:
      isHomepage && currentWidgetTheme ? currentWidgetTheme : undefined,
    activeUid: isHomepage && partnerThemeUid ? partnerThemeUid : undefined,
    imgUrl: isHomepage && imageUrl ? imageUrl : undefined,
    isSuccess: isHomepage && isSuccess,
  };
};
