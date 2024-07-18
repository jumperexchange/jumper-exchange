'use client';

import { useTheme } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import type {
  MediaAttributes,
  PartnerTheme,
  PartnerThemesData,
} from 'src/types/strapi';
import { useDexsAndBridgesKeys } from './useDexsAndBridgesKeys';

interface usePartnerThemeProps {
  isSuccess: boolean;
  hasTheme: boolean;
  isBridgeFiltered: boolean;
  isDexFiltered: boolean;
  partnerName: string;
  partnerTheme?: PartnerThemesData;
  backgroundColor?: string;
  currentCustomizedTheme?: any;
  footerImageUrl?: URL;
  footerUrl?: URL;
  availableWidgetThemeMode?: string;
  currentWidgetTheme?: PartnerTheme;
  logoUrl?: URL;
  logo?: MediaAttributes;
  imgUrl?: URL;
}

export const usePartnerTheme = (): usePartnerThemeProps => {
  const pathname = usePathname();
  const theme = useTheme();
  let hasTheme = false;
  let isBridgeFiltered = false;
  let isDexFiltered = false;
  let partnerName = '';

  // check the list of bridge that we suport the name that we use
  const { bridgesKeys, exchangesKeys } = useDexsAndBridgesKeys();

  const pathnameSplit = pathname && pathname.split('/');
  const pathnameKey =
    pathnameSplit && pathnameSplit[pathnameSplit.length - 2].toLowerCase();
  if (pathnameKey) {
    if (bridgesKeys && bridgesKeys.includes(pathnameKey)) {
      hasTheme = true;
      isBridgeFiltered = true;
      partnerName = pathnameKey;
    } else if (exchangesKeys && exchangesKeys.includes(pathnameKey)) {
      hasTheme = true;
      isDexFiltered = true;
      partnerName = pathnameKey;
    }
  }

  //fetch theme if partner-url
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_STRAPI_DEVELOP === 'true'
      ? process.env.NEXT_PUBLIC_LOCAL_STRAPI_URL
      : process.env.NEXT_PUBLIC_STRAPI_URL;
  const apiUrl = new URL(`${apiBaseUrl}/${'partner-themes'}`);
  apiUrl.searchParams.set('populate[0]', 'BackgroundImageDark');
  apiUrl.searchParams.set('populate[1]', 'BackgroundImageLight');
  apiUrl.searchParams.set('populate[2]', 'LogoLight');
  apiUrl.searchParams.set('populate[3]', 'LogoDark');
  pathnameKey && apiUrl.searchParams.set('filters[uid][$eq]', pathnameKey);
  process.env.NEXT_PUBLIC_ENVIRONMENT !== 'production' &&
    apiUrl.searchParams.set('publicationState', 'preview');
  const apiAccesToken =
    process.env.NEXT_PUBLIC_STRAPI_DEVELOP === 'true'
      ? process.env.NEXT_PUBLIC_LOCAL_STRAPI_API_TOKEN
      : process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  const { data, isSuccess } = useQuery({
    queryKey: ['partnerTheme'],

    queryFn: async () => {
      const response = await fetch(decodeURIComponent(apiUrl.href), {
        headers: {
          Authorization: `Bearer ${apiAccesToken}`,
        },
      });
      const result = await response.json();
      return result?.data?.[0]?.attributes;
    },
    enabled: !!pathnameKey,
    refetchInterval: 1000 * 60 * 60,
  });

  let imageUrl: URL | undefined = undefined;
  if (
    pathnameKey &&
    isSuccess &&
    (data?.BackgroundImageLight.data?.attributes?.url ||
      data?.BackgroundImageDark.data?.attributes?.url)
  ) {
    if (theme.palette.mode === 'light') {
      imageUrl = new URL(
        data?.BackgroundImageLight.data?.attributes?.url,
        apiUrl.origin,
      );
    } else {
      imageUrl = new URL(
        data?.BackgroundImageDark.data?.attributes?.url,
        apiUrl.origin,
      );
    }
  } else {
    imageUrl = undefined;
  }

  let backgroundColor;
  if (pathnameKey && isSuccess) {
    if (theme.palette.mode === 'light') {
      backgroundColor = data?.BackgroundColorLight;
    } else {
      backgroundColor = data?.BackgroundColorDark;
    }
  } else {
    backgroundColor = undefined;
  }

  let logoUrl;
  let logo;
  if (
    pathnameKey &&
    isSuccess &&
    (data?.LogoLight.data?.attributes?.url ||
      data?.LogoDark.data?.attributes?.url)
  ) {
    if (theme.palette.mode === 'light') {
      logoUrl = new URL(data?.LogoLight.data?.attributes?.url, apiUrl.origin);
      logo = data?.LogoLight.data?.attributes;
    } else {
      logoUrl = new URL(data?.LogoDark.data?.attributes?.url, apiUrl.origin);
      logo = data?.LogoDark.data?.attributes;
    }
  } else {
    logoUrl = undefined;
  }

  let availableWidgetThemeMode;
  if (pathnameKey && isSuccess) {
    if (data?.darkConfig) {
      availableWidgetThemeMode = 'dark';
    } else {
      availableWidgetThemeMode = 'light';
    }
  }

  let currentWidgetTheme;
  if (availableWidgetThemeMode === 'system') {
    if (theme.palette.mode === 'light') {
      currentWidgetTheme = data?.lightConfig;
    } else {
      currentWidgetTheme = data?.darkConfig;
    }
  } else if (availableWidgetThemeMode === 'dark') {
    currentWidgetTheme = data?.darkConfig;
  } else if (availableWidgetThemeMode === 'light') {
    currentWidgetTheme = data?.lightConfig;
  } else {
    currentWidgetTheme = undefined;
  }

  let currentCustomizedTheme;
  if (availableWidgetThemeMode === 'system') {
    if (theme.palette.mode === 'light') {
      currentCustomizedTheme = data?.lightConfig?.customization;
    } else {
      currentCustomizedTheme = data?.darkConfig?.customization;
    }
  } else if (availableWidgetThemeMode === 'dark') {
    currentCustomizedTheme = data?.darkConfig?.customization;
  } else if (availableWidgetThemeMode === 'light') {
    currentCustomizedTheme = data?.lightConfig?.customization;
  } else {
    currentCustomizedTheme = undefined;
  }

  if (pathname?.includes('memecoins')) {
    hasTheme = true;
    partnerName = 'memecoins';
    return {
      isSuccess: true,
      hasTheme,
      isBridgeFiltered,
      isDexFiltered,
      partnerName,
    };
  }

  return {
    isSuccess: !!pathnameKey && isSuccess,
    hasTheme,
    isBridgeFiltered,
    isDexFiltered,
    partnerName,
    backgroundColor: backgroundColor,
    currentCustomizedTheme: currentCustomizedTheme,
    availableWidgetThemeMode: availableWidgetThemeMode,
    currentWidgetTheme: currentWidgetTheme,
    logoUrl: logoUrl,
    logo: logo,
    imgUrl: imageUrl,
  };
};
