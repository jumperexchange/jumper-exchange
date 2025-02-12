import type { StrapiFeatureCardData } from '@/types/strapi';
import { useAccount } from '@lifi/wallet-management';
import { useQuery } from '@tanstack/react-query';
import { getLevelBasedOnPoints } from 'src/components/ProfilePage/LevelBox/TierBox';

export interface UsePersonalizedFeatureOnLevelProps {
  featureCards: StrapiFeatureCardData[] | undefined;
  isSuccess: boolean;
  isConnected: boolean;
}

interface FCLevelProps {
  enabled: boolean;
  points?: number;
}

const STRAPI_CONTENT_TYPE = 'feature-cards';
export const usePersonalizedFeatureOnLevel = ({
  points,
  enabled,
}: FCLevelProps): UsePersonalizedFeatureOnLevelProps => {
  const { account } = useAccount();
  const levelData = getLevelBasedOnPoints(points);
  const level = levelData.level;

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_STRAPI_DEVELOP === 'true'
      ? process.env.NEXT_PUBLIC_LOCAL_STRAPI_URL
      : `${process.env.NEXT_PUBLIC_STRAPI_URL}/api`;
  const apiUrl = new URL(`${apiBaseUrl}/${STRAPI_CONTENT_TYPE}`);

  apiUrl.searchParams.set('populate[BackgroundImageLight]', '*');
  apiUrl.searchParams.set('populate[BackgroundImageDark]', '*');
  apiUrl.searchParams.set('populate[featureCardsExclusions][fields][0]', 'uid');
  apiUrl.searchParams.set('filters[PersonalizedFeatureCard][$nei]', 'false');
  // filter to get only the personalized feature cards that have the correct levels setup
  apiUrl.searchParams.set('filters[minlevel][$lte]', String(level));
  apiUrl.searchParams.set('filters[maxLevel][$gte]', String(level));

  process.env.NEXT_PUBLIC_ENVIRONMENT !== 'production' &&
    apiUrl.searchParams.set('publicationState', 'preview');
  const apiAccesToken =
    process.env.NEXT_PUBLIC_STRAPI_DEVELOP === 'true'
      ? process.env.NEXT_PUBLIC_LOCAL_STRAPI_API_TOKEN
      : process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const { data, isSuccess } = useQuery({
    queryKey: ['personalizedFeatureCardsOnLevel'],

    queryFn: async () => {
      const response = await fetch(decodeURIComponent(apiUrl.href), {
        headers: {
          Authorization: `Bearer ${apiAccesToken}`,
        },
      });
      const result = await response.json();
      return result.data;
    },
    enabled: !!account?.address && account.chainType === 'EVM' && enabled,
    refetchInterval: 1000 * 60 * 60,
  });

  return {
    featureCards: data,
    isSuccess,
    isConnected: !!account?.address && account.chainType === 'EVM',
  };
};
