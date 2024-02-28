import { useAccounts } from './useAccounts';
import { useQuery } from '@tanstack/react-query';
import type { FeatureCardData } from 'src/types';

export interface UseQuestsProps {
  quests: any[] | undefined;
  url: URL;
  isSuccess: boolean;
}

const STRAPI_CONTENT_TYPE = 'quests';
export const useOngoingQuests = (): UseQuestsProps => {
  const apiBaseUrl =
    import.meta.env.VITE_STRAPI_DEVELOP === 'true'
      ? import.meta.env.VITE_LOCAL_STRAPI_URL
      : import.meta.env.VITE_STRAPI_URL;
  const apiUrl = new URL(`${apiBaseUrl}/${STRAPI_CONTENT_TYPE}`);
  // TODO FIND A WAY TO FETCH ONLY WHAT WE WANT
  apiUrl.searchParams.set('populate', '*');
  // apiUrl.searchParams.set('populate[1]', 'quests_platform');
  // apiUrl.searchParams.set('populate[quests_platform][populate][0]', 'Logo');
  import.meta.env.MODE !== 'production' &&
    apiUrl.searchParams.set('publicationState', 'preview');
  const apiAccesToken =
    import.meta.env.VITE_STRAPI_DEVELOP === 'true'
      ? import.meta.env.VITE_LOCAL_STRAPI_API_TOKEN
      : import.meta.env.VITE_STRAPI_API_TOKEN;
  const { data, isSuccess } = useQuery({
    queryKey: ['ongoingQuests'],

    queryFn: async () => {
      const response = await fetch(decodeURIComponent(apiUrl.href), {
        headers: {
          Authorization: `Bearer ${apiAccesToken}`,
        },
      });
      const result = await response.json();
      return result.data;
    },
    refetchInterval: 1000 * 60 * 60,
  });

  return {
    quests: data,
    url: apiUrl,
    isSuccess,
  };
};
