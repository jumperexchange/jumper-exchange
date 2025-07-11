import type { StrapiFeatureCardData } from '@/types/strapi';
import { useAccount } from '@lifi/wallet-management';
import { useQuery } from '@tanstack/react-query';
import { getLevelBasedOnPoints } from 'src/components/ProfilePage/LevelBox/TierBox';
import {
  getStrapiApiAccessToken,
  getStrapiBaseUrl,
} from 'src/utils/strapi/strapiHelper';
import config from '@/config/env-config';

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

  const apiBaseUrl = getStrapiBaseUrl();
  const apiUrl = new URL(`${apiBaseUrl}/api/${STRAPI_CONTENT_TYPE}`);

  apiUrl.searchParams.set('populate[0]', 'BackgroundImageLight');
  apiUrl.searchParams.set('populate[1]', 'BackgroundImageDark');
  apiUrl.searchParams.set('populate[2]', 'featureCardsExclusions');
  apiUrl.searchParams.set('filters[PersonalizedFeatureCard][$nei]', 'false');
  // filter to get only the personalized feature cards that have the correct levels setup
  apiUrl.searchParams.set('filters[minlevel][$lte]', String(level));
  apiUrl.searchParams.set('filters[maxLevel][$gte]', String(level));

  config.NEXT_PUBLIC_ENVIRONMENT !== 'production' &&
    apiUrl.searchParams.set('status', 'draft');
  const apiAccesToken = getStrapiApiAccessToken();
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
