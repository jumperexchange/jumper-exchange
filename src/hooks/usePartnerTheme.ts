'use client';

import { useTheme } from '@mui/material';
import { useMemo } from 'react';
import { STRAPI_PARTNER_THEMES } from 'src/const/strapiContentKeys';
import { useSettingsStore } from 'src/stores/settings';
import type { PartnerThemesData } from 'src/types/strapi';
import { shallow } from 'zustand/shallow';
import { useStrapi } from './useStrapi';

export const usePartnerTheme = () => {
  const theme = useTheme();
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

  return {
    partnerTheme: partnerThemes?.length > 0 ? partnerThemes[0] : undefined,
    activeUid: partnerThemeUid,
    imgUrl: imageUrl,
    isSuccess,
  };
};
