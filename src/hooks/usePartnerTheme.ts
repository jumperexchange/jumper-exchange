import { usePathname } from 'next/navigation';
import { useDexsAndBridgesKeys } from './useDexsAndBridgesKeys';
import { useQuery } from '@tanstack/react-query';

interface usePartnerThemeProps {
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
  // const featureCards = data?.[0]?.attributes?.feature_cards.data;

  return {
    hasTheme,
    isBridgeFiltered,
    isDexFiltered,
    partnerName,
  };
};
