import { useQuery } from '@tanstack/react-query';
import type { ExtendedQuest } from 'src/types/questDetails';
import { getQuestBy } from '@/app/lib/getQuestBy';
import { Quest } from '@/types/loyaltyPass';
import { getStrapiBaseUrl } from '@/utils/strapi/strapiHelper';

export interface UseBerachainQuestsProps {
  data: ExtendedQuest[] | undefined;
  url: string;
  isSuccess: boolean;
  isLoading: boolean;
  findFromStrapiByUid: (key: string) => Quest | null;
}

type T = Record<string, string[]>;

export const strapiBerachainMatching: T = {
  'berachain-infrared': [
    '0x2120adcdcf8e0ed9d6dd3df683f076402b79e3bd',
    '0x78c4fe43b09402a28cb1aa45c2d041f2474018fd',
    '0x1baeb82f78f55c793296e7153f2b45396ceaeb4b',
    '0xf16cc52c836e6035638843614bc4956d564c5fe0',
  ],
  'berachain-gummi': [
    '0x4a8be66cb0fea21db529108c17d1ec32d7cd3e49',
    '0x83c459782b2ff36629401b1a592354fc085f29ae00cf97b803f73cac464d389b',
    '0x0623bd8ec9e040b7bd76dbb8b2fe86d312c28cd8',
    '0xe15b622502aaef45ee31bcc23c7afa8a0d6f3192',
    '0xe382e7a75d9246c9c8196d00ef6265c50cae10fa',
  ],
  'berachain-dolomite': [
    '0xdbf9e533bfbd2aa2a9e6b933dd8657f9de90edb0',
    '0x578d5c8e4822b3b1d0a6241cb09d0be6695b1809',
  ],
  'berachain-zerolend': [
    '0xa167f33e07c7d5d0dbf546adc40d647b6f4af1d2',
    '0xded00ff949d611b9ee91ab1a086e81ecfc23bd76',
    '0xb97e63afe33f8907302c37069a044edfaa64a543',
  ],
  'berachain-kodiak': [
    '0x2785a8814434a589ce47949f4c4d3beea13760af',
    '0xc5ca5a7c4c25e35de65fb78605a9a17cbce93a0d',
  ],
};

const findKeyByValue = (obj: T) => (value: string): string | null => {
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

  function findFromStrapiByUid(uid: string) {
    const found = data?.data.find((d) => d.attributes.UID === uid)

    if (found) {
      return found;
    }

    // TODO: return default berachain
    return data?.data.find((d) => d.attributes.UID === 'berachain-default')!;
  }

  const s = findKeyByValue(strapiBerachainMatching)('0x2120adcdcf8e0ed9d6dd3df683f076402b79e3bd');
  console.log('into use', s, data?.data.find((d) => d.attributes.UID === s))

  return {
    data,
    findFromStrapiByUid: (value: string) => findFromStrapiByUid(findKeyByValue(strapiBerachainMatching)(value)),
    isLoading,
    url: getStrapiBaseUrl() || process.env.NEXT_PUBLIC_STRAPI_URL,
    isSuccess,
  };
};
