import { useQuery } from '@tanstack/react-query';
import type { FeatureCardData } from 'src/types';

export interface UseFeatureCardsProps {
  featureCards: FeatureCardData | undefined;
  url: URL;
  isSuccess: boolean;
}

const STRAPI_CONTENT_TYPE = 'feature-cards';
// Query Content-Type "featureCards" from Contentful
export const useFeatureCards = (): UseFeatureCardsProps => {
  const apiBaseUrl =
    import.meta.env.VITE_STRAPI_DEVELOP === 'true'
      ? import.meta.env.VITE_LOCAL_STRAPI_URL
      : import.meta.env.VITE_STRAPI_URL;
  const apiUrl = new URL(`${apiBaseUrl}/${STRAPI_CONTENT_TYPE}`);
  apiUrl.searchParams.set('populate[0]', 'BackgroundImageLight');
  apiUrl.searchParams.set('populate[1]', 'BackgroundImageDark');
  import.meta.env.MODE !== 'production' &&
    apiUrl.searchParams.set('publicationState', 'preview');
  const apiAccesToken =
    import.meta.env.VITE_STRAPI_DEVELOP === 'true'
      ? import.meta.env.VITE_LOCAL_STRAPI_API_TOKEN
      : import.meta.env.VITE_STRAPI_API_TOKEN;
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
