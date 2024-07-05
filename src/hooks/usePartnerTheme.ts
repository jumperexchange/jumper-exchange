import { usePathname } from 'next/navigation';
import { useDexsAndBridgesKeys } from './useDexsAndBridgesKeys';
import { useQuery } from '@tanstack/react-query';

interface usePartnerThemeProps {
  isSuccess: boolean;
  hasTheme: boolean;
  isBridgeFiltered: boolean;
  isDexFiltered: boolean;
  partnerName: string;
}

export const usePartnerTheme = (): usePartnerThemeProps => {
  const pathname = usePathname();
  let hasTheme = false;
  let isBridgeFiltered = false;
  let isDexFiltered = false;
  let partnerName = '';

  // check the list of bridge that we suport the name that we use
  const { bridgesKeys, exchangesKeys } = useDexsAndBridgesKeys();

  if (pathname?.includes('memecoins')) {
    hasTheme = true;
    partnerName = 'memecoins';
    return {
      hasTheme,
      isBridgeFiltered,
      isDexFiltered,
      partnerName,
    };
  }

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
  apiUrl.searchParams.set('filters[uid][$eq]', pathnameKey);
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
  console.log(data);

  // let imageUrl: URL | undefined = undefined;
  // if (
  //   (partnerPageThemeUid || partnerThemeUid) &&
  //   partnerThemes?.length > 0 &&
  //   isSuccess &&
  //   (partnerThemes[0].attributes.BackgroundImageLight.data?.attributes.url ||
  //     partnerThemes[0].attributes.BackgroundImageDark.data?.attributes.url)
  // ) {
  //   if (theme.palette.mode === 'light') {
  //     imageUrl = new URL(
  //       partnerThemes[0].attributes.BackgroundImageLight.data?.attributes.url,
  //       url.origin,
  //     );
  //   } else {
  //     imageUrl = new URL(
  //       partnerThemes[0].attributes.BackgroundImageDark.data?.attributes.url,
  //       url.origin,
  //     );
  //   }
  // } else {
  //   imageUrl = undefined;
  // }

  // let logoUrl;
  // let logo;
  // if (
  //   partnerThemeUid &&
  //   partnerThemes?.length > 0 &&
  //   isSuccess &&
  //   (partnerThemes[0].attributes.LogoLight.data?.attributes.url ||
  //     partnerThemes[0].attributes.LogoDark.data?.attributes.url)
  // ) {
  //   if (theme.palette.mode === 'light') {
  //     logoUrl = new URL(
  //       partnerThemes[0].attributes.LogoLight.data?.attributes.url,
  //       url.origin,
  //     );
  //     logo = partnerThemes[0].attributes.LogoLight.data?.attributes;
  //   } else {
  //     logoUrl = new URL(
  //       partnerThemes[0].attributes.LogoDark.data?.attributes.url,
  //       url.origin,
  //     );
  //     logo = partnerThemes[0].attributes.LogoDark.data?.attributes;
  //   }
  // } else {
  //   logoUrl = undefined;
  // }

  // let backgroundColor;
  // if (
  //   (partnerPageThemeUid || partnerThemeUid) &&
  //   partnerThemes?.length > 0 &&
  //   isSuccess
  // ) {
  //   if (theme.palette.mode === 'light') {
  //     backgroundColor = partnerThemes[0].attributes.BackgroundColorLight;
  //   } else {
  //     backgroundColor = partnerThemes[0].attributes.BackgroundColorDark;
  //   }
  // } else {
  //   backgroundColor = undefined;
  // }

  // let availableWidgetThemeMode;
  // if (
  //   (partnerPageThemeUid || partnerThemeUid) &&
  //   partnerThemes?.length > 0 &&
  //   isSuccess
  // ) {
  //   if (
  //     partnerThemes[0].attributes.lightConfig &&
  //     partnerThemes[0].attributes.darkConfig
  //   ) {
  //     availableWidgetThemeMode = 'system';
  //   } else if (partnerThemes[0].attributes.darkConfig) {
  //     setThemeMode('dark');
  //     availableWidgetThemeMode = 'dark';
  //   } else {
  //     setThemeMode('light');
  //     availableWidgetThemeMode = 'light';
  //   }
  // }

  // let currentWidgetTheme;
  // if (availableWidgetThemeMode === 'system') {
  //   if (theme.palette.mode === 'light') {
  //     currentWidgetTheme = partnerThemes[0].attributes.lightConfig;
  //   } else {
  //     currentWidgetTheme = partnerThemes[0].attributes.darkConfig;
  //   }
  // } else if (availableWidgetThemeMode === 'dark') {
  //   currentWidgetTheme = partnerThemes[0].attributes.darkConfig;
  // } else if (availableWidgetThemeMode === 'light') {
  //   currentWidgetTheme = partnerThemes[0].attributes.lightConfig;
  // } else {
  //   currentWidgetTheme = undefined;
  // }

  // let currentCustomizedTheme;
  // if (availableWidgetThemeMode === 'system') {
  //   if (theme.palette.mode === 'light') {
  //     currentCustomizedTheme =
  //       partnerThemes[0].attributes.lightConfig?.customization;
  //   } else {
  //     currentCustomizedTheme =
  //       partnerThemes[0].attributes.darkConfig?.customization;
  //   }
  // } else if (availableWidgetThemeMode === 'dark') {
  //   currentCustomizedTheme =
  //     partnerThemes[0].attributes.darkConfig?.customization;
  // } else if (availableWidgetThemeMode === 'light') {
  //   currentCustomizedTheme =
  //     partnerThemes[0].attributes.lightConfig?.customization;
  // } else {
  //   currentCustomizedTheme = undefined;
  // }

  return {
    isSuccess: !!pathnameKey && isSuccess,
    hasTheme,
    isBridgeFiltered,
    isDexFiltered,
    partnerName,
    // partnerTheme:
    // backgroundColor: isDapp && backgroundColor ? backgroundColor : undefined,
    // currentCustomizedTheme:
    //   isDapp && currentCustomizedTheme ? currentCustomizedTheme : undefined,
    // availableWidgetThemeMode:
    //   isDapp && availableWidgetThemeMode ? availableWidgetThemeMode : undefined,
    // currentWidgetTheme:
    //   isDapp && currentWidgetTheme ? currentWidgetTheme : undefined,
    // logoUrl: isDapp && logoUrl ? logoUrl : undefined,
    // logo: isDapp && logo ? logo : undefined,
    // imgUrl: isDapp && imageUrl ? imageUrl : undefined,
  };
};
