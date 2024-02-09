import { useQuery } from '@tanstack/react-query';
import { useWallet } from 'src/providers';
import type { FeatureCardData } from 'src/types';

export interface UseFetchUserProps {
  featureCards: FeatureCardData[] | undefined;
  isSuccess: boolean;
  isConnected: boolean;
}

const STRAPI_CONTENT_TYPE = 'jumper-users';
// Query Content-Type "featureCards" from Contentful
export const useFetchUser = (): UseFetchUserProps => {
  const { account } = useWallet();

  const apiBaseUrl =
    import.meta.env.VITE_STRAPI_DEVELOP === 'true'
      ? import.meta.env.VITE_LOCAL_STRAPI_URL
      : import.meta.env.VITE_STRAPI_URL;
  const apiUrl = new URL(`${apiBaseUrl}/${STRAPI_CONTENT_TYPE}`);
  apiUrl.searchParams.set('populate[0]', 'feature_cards');
  apiUrl.searchParams.set(
    'populate[feature_cards][populate][0]',
    'BackgroundImageLight',
  );
  apiUrl.searchParams.set(
    'populate[feature_cards][populate][1]',
    'BackgroundImageDark',
  );
  if (account.address) {
    apiUrl.searchParams.set(
      'filters[EvmWalletAddress][$eqi]',
      account?.address,
    );
  }
  import.meta.env.MODE !== 'production' &&
    apiUrl.searchParams.set('publicationState', 'preview');
  const apiAccesToken =
    import.meta.env.VITE_STRAPI_DEVELOP === 'true'
      ? import.meta.env.VITE_LOCAL_STRAPI_API_TOKEN
      : import.meta.env.VITE_STRAPI_API_TOKEN;
  const { data, isSuccess } = useQuery({
    queryKey: ['jumperUser'],

    queryFn: async () => {
      const response = await fetch(decodeURIComponent(apiUrl.href), {
        headers: {
          Authorization: `Bearer ${apiAccesToken}`,
        },
      });
      const result = await response.json();
      return result.data;
    },
    enabled: !!account.address,
    refetchInterval: 1000 * 60 * 60,
  });
  const featureCards = data?.[0]?.attributes?.feature_cards.data;

  return {
    featureCards: featureCards ?? undefined,
    isSuccess,
    isConnected: !!account.address,
  };
};
