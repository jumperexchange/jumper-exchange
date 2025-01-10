import { useQuery } from '@tanstack/react-query';
import type { ExtendedQuest } from 'src/types/questDetails';
import { getQuestBy } from '@/app/lib/getQuestBy';
import type { Quest } from '@/types/loyaltyPass';
import { getStrapiBaseUrl } from '@/utils/strapi/strapiHelper';
import type { StrapiResponse } from '@/types/strapi';

export interface UseBerachainQuestsProps {
  data?: StrapiResponse<Quest>;
  url: string;
  isSuccess: boolean;
  isLoading: boolean;
  findFromStrapiByUid: (key: string) => Quest | undefined;
}

type T = Record<string, string[]>;

export const strapiBerachainMatching: T = {
  'berachain-moby': [
    '0x02b3fbf71d027698992f4d25c21579b3d6be19aae510b9568b3f4a07735eb6ae',
  ],
  'berachain-beraborrow': [
    '0xe9361c6676c14fe04c72c841d1db72280e0db59b563d5f3e236400078cb4e235',
  ],
  'berachain-burrbear': [
    '0x2a8b3660ee8d64a6464648dce594afb92d6697e06264c936ea8f96f4c1cc73eb',
    '0x7b5bf8336ed469737813a9d3d2cfd77970d9c2a033ae0c64bb94d720860e9161',
  ],
  'berachain-concrete': ['0xb51ae13ed205542da886164148cd8c4d4366dd73'],
  'berachain-reservoir': [
    '0x67ce48013dc6509385f4717d73f301db9a1295e07c54fe5d15c100c655b74d80',
  ],
  'berachain-dalhia': ['0xe86a17a5e498161b19f9aaa374240473b8e2e5e9'],
  'berachain-goldilocks': [
    '0x75091cb3ba55fe7af132865c9a9d97c57203c2b7c8aca6c293c4cf1a9f1c765f',
  ],
  'berachain-infrared': [
    '0xda51d0e8b23511146ab4c2058859473536fef2f7ae7edb52c99c947b292cbbc1',
  ],
  'berachain-gummi': [
    '0xafac66433f00d152c43097707811594b6c2781e4baaccd8d3be6cd3d3af4d600',
  ],
  'berachain-dolomite': [
    '0x2358c05d965774d2db56493dfa94ce3edb7e78a35ebcbff30c112db54a008ce4',
  ],
  'berachain-zerolend': ['0xbe2a22476b6e3658fddd04c20928f52929aa4019'],
  'berachain-kodiak': ['0x562113d1608a60807e2a474d037465b7868409fc'],
  'berachain-setandforgetti': [
    '0xda51d0e8b23511146ab4c2058859473536fef2f7ae7edb52c99c947b292cbbc1',
  ],
  'berachain-satlayer': [
    '0xb7a4762722bc11627db15058c2067772831a6c869955784f79db9ecd90bec87a',
  ],
};

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
      const { data } = await getQuestBy('Label', 'berachain');

      return data;
    },
    refetchInterval: 1000 * 60 * 60,
  });

  function findFromStrapiByUid(uid: string | null) {
    const found = data?.data.find((d) => d.attributes.UID === uid);

    if (found) {
      return found;
    }

    // if (!found) {
    //   return undefined;
    // }

    // TODO: return default berachain
    // return data?.data.find((d) => d.attributes.UID === 'berachain-default')!;
  }

  return {
    data,
    findFromStrapiByUid: (value: string) =>
      findFromStrapiByUid(findKeyByValue(strapiBerachainMatching)(value)),
    isLoading,
    url: getStrapiBaseUrl() || process.env.NEXT_PUBLIC_STRAPI_URL,
    isSuccess,
  };
};
