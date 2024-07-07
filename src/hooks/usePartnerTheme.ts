'use client';

import { useIsDapp } from '@/hooks/useIsDapp';
import { useStrapi } from '@/hooks/useStrapi';
import { useTheme } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { STRAPI_PARTNER_THEMES } from 'src/const/strapiContentKeys';
import { useSettingsStore } from 'src/stores/settings';
import type {
  MediaAttributes,
  PartnerTheme,
  PartnerThemesData,
} from 'src/types/strapi';
import { shallow } from 'zustand/shallow';
import { usePartnerFilter } from './usePartnerFilter';

interface Logo {
  logoUrl?: URL;
  logoObj?: MediaAttributes;
}
interface usePartnerThemeProps {
  partnerTheme?: PartnerThemesData;
  backgroundColor?: string;
  currentCustomizedTheme?: any;
  footerImageUrl?: URL;
  footerUrl?: URL;
  availableWidgetThemeMode?: string;
  currentWidgetTheme?: PartnerTheme;
  logo?: Logo;
  activeUid?: string;
  imgUrl?: URL;
  isSuccess?: boolean;
}

export const usePartnerTheme = (): usePartnerThemeProps => {
  const theme = useTheme();
  const isDapp = useIsDapp();
  const { partnerName, hasTheme } = usePartnerFilter();

  const [partnerThemeUid, setThemeMode] = useSettingsStore(
    (state) => [state.partnerThemeUid, state.setThemeMode],
    shallow,
  );

  const {
    data: partnerThemes,
    isSuccess,
    url,
  } = useStrapi<PartnerThemesData>({
    contentType: STRAPI_PARTNER_THEMES,
    queryKey: ['partner-themes-filter', partnerName || partnerThemeUid],
    filterUid: partnerName || partnerThemeUid,
  });

  const imageUrl: URL | undefined = useMemo(() => {
    if (
      (hasTheme || partnerThemeUid) &&
      partnerThemes?.length > 0 &&
      isSuccess &&
      (partnerThemes[0].attributes.BackgroundImageLight.data?.attributes.url ||
        partnerThemes[0].attributes.BackgroundImageDark.data?.attributes.url)
    ) {
      if (theme.palette.mode === 'light') {
        return new URL(
          partnerThemes[0].attributes.BackgroundImageLight.data?.attributes.url,
          url.origin,
        );
      } else {
        return new URL(
          partnerThemes[0].attributes.BackgroundImageDark.data?.attributes.url,
          url.origin,
        );
      }
    } else {
      return undefined;
    }
  }, [
    hasTheme,
    isSuccess,
    partnerThemeUid,
    partnerThemes,
    theme.palette.mode,
    url.origin,
  ]);

  const footerImageUrl = useMemo(() => {
    if (
      (hasTheme || partnerThemeUid) &&
      partnerThemes?.length > 0 &&
      isSuccess &&
      (partnerThemes[0].attributes.FooterImageLight.data?.attributes.url ||
        partnerThemes[0].attributes.FooterImageDark.data?.attributes.url)
    ) {
      if (theme.palette.mode === 'light') {
        return new URL(
          partnerThemes[0].attributes.FooterImageLight.data?.attributes.url,
          url.origin,
        );
      } else {
        return new URL(
          partnerThemes[0].attributes.FooterImageDark.data?.attributes.url,
          url.origin,
        );
      }
    } else {
      return undefined;
    }
  }, [
    hasTheme,
    isSuccess,
    partnerThemeUid,
    partnerThemes,
    theme.palette.mode,
    url.origin,
  ]);

  const footerUrl = useMemo(() => {
    if (
      (hasTheme || partnerThemeUid) &&
      partnerThemes?.length > 0 &&
      isSuccess &&
      partnerThemes[0].attributes.PartnerURL
    ) {
      return new URL(partnerThemes[0].attributes.PartnerURL, url.origin);
    } else {
      return undefined;
    }
  }, [hasTheme, isSuccess, partnerThemeUid, partnerThemes, url.origin]);

  const logo: Logo = useMemo(() => {
    let logoUrl;
    let logoObj;
    if (
      partnerThemeUid &&
      partnerThemes?.length > 0 &&
      isSuccess &&
      (partnerThemes[0].attributes.LogoLight.data?.attributes.url ||
        partnerThemes[0].attributes.LogoDark.data?.attributes.url)
    ) {
      if (theme.palette.mode === 'light') {
        console.log(
          'TEST light ',
          partnerThemes[0].attributes.LogoLight.data?.attributes.url,
        );
        logoUrl = new URL(
          partnerThemes[0].attributes.LogoLight.data?.attributes.url,
          url.origin,
        );
        logoObj = partnerThemes[0].attributes.LogoLight.data?.attributes;
      } else {
        console.log(
          'TEST dark',
          partnerThemes[0].attributes.LogoDark.data?.attributes.url,
        );
        logoUrl = new URL(
          partnerThemes[0].attributes.LogoDark.data?.attributes.url,
          url.origin,
        );
        logoObj = partnerThemes[0].attributes.LogoDark.data?.attributes;
      }
    }
    return { logoUrl, logoObj };
  }, [
    isSuccess,
    partnerThemeUid,
    partnerThemes,
    theme.palette.mode,
    url.origin,
  ]);

  const backgroundColor = useMemo(() => {
    if (
      (hasTheme || partnerThemeUid) &&
      partnerThemes?.length > 0 &&
      isSuccess
    ) {
      if (theme.palette.mode === 'light') {
        return partnerThemes[0].attributes.BackgroundColorLight;
      } else {
        return partnerThemes[0].attributes.BackgroundColorDark;
      }
    } else {
      return undefined;
    }
  }, [hasTheme, isSuccess, partnerThemeUid, partnerThemes, theme.palette.mode]);

  const availableWidgetThemeMode = useMemo(() => {
    if (
      (hasTheme || partnerThemeUid) &&
      partnerThemes?.length > 0 &&
      isSuccess
    ) {
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
  }, [hasTheme, isSuccess, partnerThemeUid, partnerThemes]);

  // Move the state update to useEffect
  useEffect(() => {
    if (availableWidgetThemeMode) {
      if (availableWidgetThemeMode === 'dark') {
        setThemeMode('dark');
      } else if (availableWidgetThemeMode === 'light') {
        setThemeMode('light');
      }
    }
  }, [availableWidgetThemeMode, setThemeMode]);

  const currentWidgetTheme = useMemo(() => {
    if (availableWidgetThemeMode === 'system') {
      if (theme.palette.mode === 'light') {
        return partnerThemes[0].attributes.lightConfig;
      } else {
        return partnerThemes[0].attributes.darkConfig;
      }
    } else if (availableWidgetThemeMode === 'dark') {
      return partnerThemes[0].attributes.darkConfig;
    } else if (availableWidgetThemeMode === 'light') {
      return partnerThemes[0].attributes.lightConfig;
    } else {
      return undefined;
    }
  }, [availableWidgetThemeMode, partnerThemes, theme.palette.mode]);

  const currentCustomizedTheme = useMemo(() => {
    if (availableWidgetThemeMode === 'system') {
      if (theme.palette.mode === 'light') {
        return partnerThemes[0].attributes.lightConfig?.customization;
      } else {
        return partnerThemes[0].attributes.darkConfig?.customization;
      }
    } else if (availableWidgetThemeMode === 'dark') {
      return partnerThemes[0].attributes.darkConfig?.customization;
    } else if (availableWidgetThemeMode === 'light') {
      return partnerThemes[0].attributes.lightConfig?.customization;
    } else {
      return undefined;
    }
  }, [availableWidgetThemeMode, partnerThemes, theme.palette.mode]);

  return {
    partnerTheme:
      isDapp && partnerThemes?.length > 0 ? partnerThemes[0] : undefined,
    backgroundColor: isDapp && backgroundColor ? backgroundColor : undefined,
    currentCustomizedTheme:
      isDapp && currentCustomizedTheme ? currentCustomizedTheme : undefined,
    footerImageUrl: isDapp && footerImageUrl ? footerImageUrl : undefined,
    footerUrl: isDapp && !!footerUrl ? new URL(footerUrl) : undefined,
    availableWidgetThemeMode:
      isDapp && availableWidgetThemeMode ? availableWidgetThemeMode : undefined,
    currentWidgetTheme:
      isDapp && currentWidgetTheme ? currentWidgetTheme : undefined,
    logo: isDapp && logo ? logo : undefined,
    activeUid:
      (isDapp && partnerName) || (isDapp && partnerThemeUid) || undefined,
    imgUrl: isDapp && imageUrl ? imageUrl : undefined,
    isSuccess: isDapp && isSuccess,
  };
};
