import { useQuery } from '@tanstack/react-query';
import type { FeatureCardData } from '../types';

export interface UseFeatureCardsProps {
  featureCards: FeatureCardData | undefined;
  url: URL;
  isSuccess: boolean;
}

const STRAPI_CONTENT_TYPE = 'feature-cards';
// Query Content-Type "featureCards" from Contentful
export const useFeatureCards = (): UseFeatureCardsProps => {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_STRAPI_DEVELOP === 'true'
      ? process.env.NEXT_PUBLIC_STRAPI_LOCAL_URL
      : process.env.NEXT_PUBLIC_STRAPI_URL;
  const apiUrl = new URL(`${apiBaseUrl}/${STRAPI_CONTENT_TYPE}`);
  apiUrl.searchParams.set('populate[0]', 'BackgroundImageLight');
  apiUrl.searchParams.set('populate[1]', 'BackgroundImageDark');
  process.env.MODE !== 'production' &&
    apiUrl.searchParams.set('publicationState', 'preview');
  const apiAccesToken =
    process.env.NEXT_PUBLIC_STRAPI_DEVELOP === 'true'
      ? process.env.NEXT_PUBLIC_STRAPI_API_TOKEN
      : process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const { data, isSuccess } = useQuery({
    queryKey: ['featureCard'],

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
  return {
    featureCards: data ?? undefined,
    url: apiUrl,
    isSuccess,
  };
};
