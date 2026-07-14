import { useAccount } from '@jumperexchange/wallet-management';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import config from '@/config/env-config';
import type { Notification, NotificationCategory } from '@/types/notifications';

interface UseNotificationsParams {
  enabled?: boolean;
  category?: NotificationCategory | null;
  createdAfter?: string;
  createdBefore?: string;
  limit?: number;
  offset?: number;
}

type NotificationsQueryFilters = Omit<UseNotificationsParams, 'enabled'>;

export const notificationsQueryKey = (
  address?: string,
  filters?: NotificationsQueryFilters,
) => ['notifications', address, filters ?? {}] as const;

export const useNotifications = ({
  enabled = true,
  category,
  createdAfter,
  createdBefore,
  limit,
  offset,
}: UseNotificationsParams = {}) => {
  const { account } = useAccount();

  const filters: NotificationsQueryFilters = {};
  if (category != null) {
    filters.category = category;
  }
  if (createdAfter != null) {
    filters.createdAfter = createdAfter;
  }
  if (createdBefore != null) {
    filters.createdBefore = createdBefore;
  }
  if (limit != null) {
    filters.limit = limit;
  }
  if (offset != null) {
    filters.offset = offset;
  }

  const address = account?.address;

  return useQuery({
    queryKey: notificationsQueryKey(address, filters),
    queryFn: async ({ signal }) => {
      if (!address) {
        throw new Error('Cannot fetch notifications without a wallet address');
      }

      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(filters)) {
        if (value != null) {
          params.set(key, String(value));
        }
      }

      const qs = params.toString();
      const url = `${config.NEXT_PUBLIC_NOTIFICATIONS_URL}/api/notifications/${address}${qs ? `?${qs}` : ''}`;

      const response = await fetch(url, { signal });
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      return response.json() as Promise<Notification[]>;
    },
    staleTime: 10_000,
    placeholderData: keepPreviousData,
    enabled: enabled && !!address && !!config.NEXT_PUBLIC_NOTIFICATIONS_URL,
  });
};
