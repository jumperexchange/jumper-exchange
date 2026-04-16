import { useAccount } from '@lifi/wallet-management';
import { useQuery } from '@tanstack/react-query';
import config from '@/config/env-config';
import type { Notification } from '@/types/notifications';

export const notificationsQueryKey = (address?: string) =>
  ['notifications', address] as const;

export const useNotifications = ({
  enabled = true,
}: { enabled?: boolean } = {}) => {
  const { account } = useAccount();

  return useQuery({
    queryKey: notificationsQueryKey(account?.address),
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
    staleTime: 10_000,
    enabled:
      enabled && !!account?.address && !!config.NEXT_PUBLIC_NOTIFICATIONS_URL,
  });
};
