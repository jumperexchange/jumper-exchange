import { useQuery } from '@tanstack/react-query';
import type { Quest } from 'src/types';

export interface UseQuestsProps {
  quests: Quest[] | undefined;
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
  //populate url
  apiUrl.searchParams.set('populate[0]', 'Image');
  apiUrl.searchParams.set('populate[1]', 'quests_platform');
  apiUrl.searchParams.set('populate[2]', 'quests_platform.Logo');
  //sort url
  apiUrl.searchParams.set('sort[0]', 'id:desc');
  //filter url
  const currentDate = new Date(Date.now()).toISOString().split('T')[0];
  apiUrl.searchParams.set('filters[StartDate][$lte]', currentDate);
  apiUrl.searchParams.set('filters[EndDate][$gte]', currentDate);
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
