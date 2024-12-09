import { useQuery } from '@tanstack/react-query';
import type { ExtendedQuest } from 'src/types/questDetails';
import { getQuestBy } from '@/app/lib/getQuestBy';
import { getStrapiBaseUrl } from '@/components/Berachain/components/BerachainProtocolAction/BerachainProtocolAction';

export interface UseBerachainQuestsProps {
  data: ExtendedQuest[] | undefined;
  url: string;
  isSuccess: boolean;
  isLoading: boolean;
}

export const useBerachainMarkets = (): UseBerachainQuestsProps => {
  // const markets = data.flatMap((market) => market.protocol.name);
  // const apiUrl = new URL(getStrapiUrl(STRAPI_CONTENT_TYPE));

  // const urlParams = new QuestStrapiApi().filterBy('Label', 'berachain');
  // const apiBaseUrl = urlParams.getApiBaseUrl();
  // const apiUrl = urlParams.getApiUrl();
  // const accessToken = urlParams.getApiAccessToken();

  //selected needed field
  // apiUrl.searchParams.set('fields[0]', 'Title'); // title
  // apiUrl.searchParams.set('fields[1]', 'Points'); // points
  // apiUrl.searchParams.set('fields[2]', 'Link'); // link
  // apiUrl.searchParams.set('fields[3]', 'StartDate'); // startDate
  // apiUrl.searchParams.set('fields[4]', 'EndDate'); // endDate
  // apiUrl.searchParams.set('fields[5]', 'Slug'); // Slug
  // apiUrl.searchParams.set('fields[6]', 'Label'); // label
  // apiUrl.searchParams.set('fields[7]', 'CustomInformation'); // CustomInformation
  // apiUrl.searchParams.set('fields[8]', 'Category'); // Category
  //populate url
  // apiUrl.searchParams.set('populate[]', '*');
  // // apiUrl.searchParams.set('populate[1]', 'quests_platform');
  // // apiUrl.searchParams.set('populate[2]', 'quests_platform.Logo');
  // //sort url
  // apiUrl.searchParams.set('sort[0]', 'id:desc');
  // //filter url
  // apiUrl.searchParams.set('pagination[pageSize]', '50');
  // apiUrl.searchParams.set('filters[Label][$eq]', 'berachain');

  // apiUrl.searchParams.set('filters[Points][$gte]', '0');
  // const currentDate = new Date(Date.now()).toISOString().split('T')[0];
  // apiUrl.searchParams.set('filters[StartDate][$lte]', currentDate);
  // apiUrl.searchParams.set('filters[EndDate][$gte]', currentDate);
  // process.env.NEXT_PUBLIC_ENVIRONMENT !== 'production' &&
  //   apiUrl.searchParams.set('publicationState', 'preview');
  // const apiAccesToken =
  //   process.env.NEXT_PUBLIC_STRAPI_DEVELOP === 'true'
  //     ? process.env.NEXT_PUBLIC_LOCAL_STRAPI_API_TOKEN
  //     : process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['berachain-markets'],

    queryFn: async () => {
      const { data } = await getQuestBy('Label', 'berachain');

      return data;
    },
    refetchInterval: 1000 * 60 * 60,
  });

  return {
    data,
    isLoading,
    url: getStrapiBaseUrl() || process.env.NEXT_PUBLIC_STRAPI_URL,
    isSuccess,
  };
};
