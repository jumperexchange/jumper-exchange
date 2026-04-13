import { useAccount } from '@lifi/wallet-management';
import { useQuery } from '@tanstack/react-query';
import config from '@/config/env-config';
import type { Notification } from '@/types/notifications';
import { TWO_SECONDS_MS } from 'src/const/time';

export const useNotifications = () => {
  const { account } = useAccount();

  return useQuery({
    queryKey: ['notifications', account?.address],
    queryFn: async ({ signal }) => {
      const response = await fetch(
        `${config.NEXT_PUBLIC_NOTIFICATIONS_URL}/api/notifications/${account?.address}`,
        { signal },
      );
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      return response.json() as Promise<Notification[]>;
    },
    enabled: !!account?.address && !!config.NEXT_PUBLIC_NOTIFICATIONS_URL,
    refetchInterval: TWO_SECONDS_MS,
  });
};
