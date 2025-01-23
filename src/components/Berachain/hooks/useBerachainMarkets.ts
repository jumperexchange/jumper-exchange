import { useQuery } from '@tanstack/react-query';
import { getQuestsBy } from '@/app/lib/getQuestsBy';
import { getStrapiBaseUrl } from '@/utils/strapi/strapiHelper';
import type { StrapiResponse } from '@/types/strapi';
import type { QuestWithExtraRewards } from '@/components/Berachain/BerachainType';

export interface UseBerachainQuestsProps {
  data?: StrapiResponse<QuestWithExtraRewards>;
  url: string;
  isSuccess: boolean;
  isLoading: boolean;
  findFromStrapiByUid: (key: string) => QuestWithExtraRewards | undefined;
}

type T = Record<string, string[]>;

const findKeyByValue =
  (obj: T) =>
  (value: string): string | null => {
    // Use Object.entries to iterate through key-value pairs
    for (const [key, array] of Object.entries(obj)) {
      if (array.includes(value)) {
        return key; // Return the key if the value is found
      }
    }

    // Default it to berachain
    return 'berachain'; // Return null if no match is found
  };

export const useBerachainMarkets = (): UseBerachainQuestsProps => {
  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['berachain-markets'],

    queryFn: async () => {
      const { data } = await getQuestsBy('Label', 'berachain');

      return data;
    },
    refetchInterval: 1000 * 60 * 60,
  });

  function findFromStrapiByUid(uid: string | null) {
    const found = data?.data.find((d) => {
      return uid && d.attributes?.CustomInformation?.marketIds?.includes(uid)
    });

    if (found) {
      return found;
    }

    // TODO: return default berachain
    return data?.data.find((d) => d.attributes?.UID === 'berachain-default')!;
  }

  return {
    data,
    findFromStrapiByUid,
    isLoading,
    url: getStrapiBaseUrl() || process.env.NEXT_PUBLIC_STRAPI_URL,
    isSuccess,
  };
};
