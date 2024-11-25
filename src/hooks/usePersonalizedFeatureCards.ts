import { useAccount } from '@lifi/wallet-management';
import { useQuery } from '@tanstack/react-query';
import type { FeatureCardData } from '@/types/strapi';

export interface UsePersonalizedFeatureCardsProps {
  data: FeatureCardData[];
  isSuccess: boolean;
  isConnected: boolean;
}

function getFeatureCardsEndpoint(walletAddress: string): string {
  return `${process.env.NEXT_PUBLIC_BACKEND_URL}/wallets/${walletAddress}/feature-cards`;
}

const STRAPI_CONTENT_TYPE = 'feature-cards';
export const usePersonalizedFeatureCards =
  (): UsePersonalizedFeatureCardsProps => {
    const { account } = useAccount();

    const { data: fcCardData, isSuccess: fcCardDataIsSuccess } = useQuery({
      queryKey: ['jumperUser', account?.address],
      queryFn: async () => {
        const response = await fetch(
          getFeatureCardsEndpoint(account?.address!),
        );

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const result = await response.json();

        return result.data;
      },
      enabled: !!account?.address,
      refetchInterval: 1000 * 60 * 60,
    });

    const apiBaseUrl =
      process.env.NEXT_PUBLIC_STRAPI_DEVELOP === 'true'
        ? process.env.NEXT_PUBLIC_LOCAL_STRAPI_URL
        : `${process.env.NEXT_PUBLIC_STRAPI_URL}/api`;
    const apiUrl = new URL(`${apiBaseUrl}/${STRAPI_CONTENT_TYPE}`);

    apiUrl.searchParams.set('populate[BackgroundImageLight]', '*');
    apiUrl.searchParams.set('populate[BackgroundImageDark]', '*');
    apiUrl.searchParams.set(
      'populate[featureCardsExclusions][fields][0]',
      'uid',
    );
    apiUrl.searchParams.set('filters[PersonalizedFeatureCard]', 'true');
    fcCardData?.map((id: number) =>
      apiUrl.searchParams.set('filters[id][]', id.toString()),
    );

    process.env.NEXT_PUBLIC_ENVIRONMENT !== 'production' &&
      apiUrl.searchParams.set('publicationState', 'preview');
    const apiAccesToken =
      process.env.NEXT_PUBLIC_STRAPI_DEVELOP === 'true'
        ? process.env.NEXT_PUBLIC_LOCAL_STRAPI_API_TOKEN
        : process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

    const { data, isSuccess } = useQuery({
      queryKey: ['personalizedFeatureCardsOnAddress', account?.address],

      queryFn: async () => {
        const response = await fetch(decodeURIComponent(apiUrl.href), {
          headers: {
            Authorization: `Bearer ${apiAccesToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const result = await response.json();
        return result.data;
      },
      enabled: fcCardData?.length > 0 && fcCardDataIsSuccess && !!account?.address,
      refetchInterval: 1000 * 60 * 60,
    });

    return {
      data,
      isSuccess,
      isConnected: !!account?.address,
    };
  };
