import type { FeatureCardData } from '@/types/strapi';
import { useQuery } from '@tanstack/react-query';
import { useAccounts } from './useAccounts';

export interface UsePersonalizedFeatureCardsProps {
  featureCards: FeatureCardData[] | undefined;
  isSuccess: boolean;
  isConnected: boolean;
}

interface FCNoUsersProps {
  enabled: boolean;
}

const STRAPI_CONTENT_TYPE = 'feature-cards';
export const usePersonalizedFeatureCardsNoUsers = ({
  enabled,
}: FCNoUsersProps): UsePersonalizedFeatureCardsProps => {
  const { account } = useAccounts();

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_STRAPI_DEVELOP === 'true'
      ? process.env.NEXT_PUBLIC_LOCAL_STRAPI_URL
      : process.env.NEXT_PUBLIC_STRAPI_URL;
  const apiUrl = new URL(
    `${apiBaseUrl}/${STRAPI_CONTENT_TYPE}?jumper_users_null&jumper_users_empty`,
  );

  apiUrl.searchParams.set('populate[BackgroundImageLight]', '*');
  apiUrl.searchParams.set('populate[BackgroundImageDark]', '*');
  apiUrl.searchParams.set('populate[jumper_users]', '*');
  apiUrl.searchParams.set('populate[featureCardsExclusions][fields][0]', 'uid');
  apiUrl.searchParams.set('filters[PersonalizedFeatureCard][$nei]', 'false');
  // filter to get only the personalized feature cards that have no jumper users associated.
  apiUrl.searchParams.set(
    'filters[jumper_users][EvmWalletAddress][$null]',
    'true',
  );

  process.env.NEXT_PUBLIC_ENVIRONMENT !== 'production' &&
    apiUrl.searchParams.set('publicationState', 'preview');
  const apiAccesToken =
    process.env.NEXT_PUBLIC_STRAPI_DEVELOP === 'true'
      ? process.env.NEXT_PUBLIC_LOCAL_STRAPI_API_TOKEN
      : process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const { data, isSuccess } = useQuery({
    queryKey: ['personalizedFeatureCardsNoUsers'],

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
