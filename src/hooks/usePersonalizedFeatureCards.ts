import { useAccount } from '@lifi/wallet-management';
import { useQuery } from '@tanstack/react-query';

export interface UsePersonalizedFeatureCardsProps {
  data: number[];
  isSuccess: boolean;
  isConnected: boolean;
}

function getFeatureCardsEndpoint(walletAddress: string): string {
  return `${process.env.NEXT_PUBLIC_BACKEND_URL}/wallets/${walletAddress}/feature-cards`;
}

export const usePersonalizedFeatureCards =
  (): UsePersonalizedFeatureCardsProps => {
    const { account } = useAccount();

    const { data, isSuccess } = useQuery({
      queryKey: ['jumperUser', account?.address],
      queryFn: async () => {
        const response = await fetch(getFeatureCardsEndpoint(account?.address!));
        const result = await response.json();

        return result.data;
      },
      enabled: !!account?.address,
      refetchInterval: 1000 * 60 * 60,
    });

    return {
      data,
      isSuccess,
      isConnected: !!account?.address
    };
  };
