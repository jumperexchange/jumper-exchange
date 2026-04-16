import { useAccount } from '@lifi/wallet-management';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import config from '@/config/env-config';
import { FIFTEEN_SECONDS_MS } from '@/const/time';
import type { NotificationSummary } from '@/types/notifications';

class NotificationsSummaryError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'NotificationsSummaryError';
  }
}

export const notificationsSummaryQueryKey = (address?: string) =>
  ['notifications-summary', address] as const;

const walletAddressPattern = /^0x[a-fA-F0-9]{40}$/;

export const useNotificationsSummary = () => {
  const { account } = useAccount();
  const address = account?.address;
  const isValidWalletAddress =
    typeof address === 'string' && walletAddressPattern.test(address);

  return useQuery({
    queryKey: notificationsSummaryQueryKey(address),
    queryFn: async ({ signal }) => {
      const response = await fetch(
        `${config.NEXT_PUBLIC_NOTIFICATIONS_URL}/api/notifications/${address}/summary`,
        { signal },
      );

      if (!response.ok) {
        throw new NotificationsSummaryError(
          'Failed to fetch notification summary',
          response.status,
        );
      }

      return response.json() as Promise<NotificationSummary>;
    },
    enabled: isValidWalletAddress && !!config.NEXT_PUBLIC_NOTIFICATIONS_URL,
    refetchInterval: FIFTEEN_SECONDS_MS,
    staleTime: FIFTEEN_SECONDS_MS,
    placeholderData: keepPreviousData,
    retry: (failureCount, error) => {
      if (
        error instanceof NotificationsSummaryError &&
        error.status >= 400 &&
        error.status < 500
      ) {
        return false;
      }
      return failureCount < 3;
    },
  });
};
