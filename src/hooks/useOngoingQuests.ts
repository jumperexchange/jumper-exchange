import type { Quest } from '@/types/loyaltyPass';
import { useQuery } from '@tanstack/react-query';
import { createQuestStrapiApi } from 'src/utils/strapi/generateStrapiUrl';

export interface UseQuestsProps {
  quests: Quest[] | undefined;
  url: string;
  isSuccess: boolean;
  isQuestLoading: boolean;
}

export const useOngoingQuests = (): UseQuestsProps => {
  const quests = createQuestStrapiApi().sort('desc').addPaginationParams({
    page: 1,
    pageSize: 50,
  });

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['ongoingQuests'],

    queryFn: async () => {
      const response = await fetch(decodeURIComponent(quests.getApiUrl()), {
        headers: {
          Authorization: `Bearer ${quests.getApiAccessToken()}`,
        },
      });
      const result = await response.json();
      return result.data;
    },
    refetchInterval: 1000 * 60 * 60,
  });

  return {
    quests: data,
    isQuestLoading: isLoading,
    url: quests.getApiUrl(),
    isSuccess,
  };
};
