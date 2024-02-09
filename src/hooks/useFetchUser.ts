import { useQuery } from '@tanstack/react-query';
import type { FeatureCardData } from 'src/types';

export interface UseFetchUserProps {
  featureCards: FeatureCardData[] | undefined;
  isSuccess: boolean;
}

const STRAPI_CONTENT_TYPE = 'jumper-users';
// Query Content-Type "featureCards" from Contentful
export const useFetchUser = (EvmWalletAddress: string): UseFetchUserProps => {
  const apiBaseUrl =
    import.meta.env.VITE_STRAPI_DEVELOP === 'true'
      ? import.meta.env.VITE_LOCAL_STRAPI_URL
      : import.meta.env.VITE_STRAPI_URL;
  const apiUrl = new URL(`${apiBaseUrl}/${STRAPI_CONTENT_TYPE}`);
  apiUrl.searchParams.set('populate[0]', 'feature_cards');
  apiUrl.searchParams.set('filters[EvmWalletAddress][$eq]', EvmWalletAddress);
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
    enabled: true,
    refetchInterval: 1000 * 60 * 60,
  });

  // Todo: transform in the right featureCard format the return from strapi
  console.log(data);
  const featureCards = data?.attributes?.feature_cards.data;
  console.log(featureCards);

  return {
    featureCards: featureCards ?? undefined,
    isSuccess,
  };
};
