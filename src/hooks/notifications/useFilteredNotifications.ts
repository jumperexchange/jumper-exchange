import { useAccount } from '@lifi/wallet-management';
import { useMemo, useState } from 'react';
import { ONE_DAY_MS, ONE_WEEK_MS, THIRTY_DAYS_MS } from '@/const/time';
import { useNotificationStore } from '@/stores/notifications/NotificationStore';
import type { NotificationCategory } from '@/types/notifications';
import { useNotifications } from './useNotifications';

export type DateFilter = 'all' | 'today' | 'week' | 'month';

interface UseFilteredNotificationsParams {
  enabled?: boolean;
}

const dateFilterToCreatedAfter = (
  dateFilter: DateFilter,
): string | undefined => {
  if (dateFilter === 'all') {
    return undefined;
  }
  const msMap: Record<Exclude<DateFilter, 'all'>, number> = {
    today: ONE_DAY_MS,
    week: ONE_WEEK_MS,
    month: THIRTY_DAYS_MS,
  };
  return new Date(Date.now() - msMap[dateFilter]).toISOString();
};

export const useFilteredNotifications = ({
  enabled = true,
}: UseFilteredNotificationsParams = {}) => {
  const { account } = useAccount();
  const address = account?.address ?? '';

  const [categoryFilter, setCategoryFilter] =
    useState<NotificationCategory | null>(null);
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');

  const createdAfter = useMemo(
    () => dateFilterToCreatedAfter(dateFilter),
    [dateFilter],
  );

  const { data: notifications } = useNotifications({
    enabled,
    category: categoryFilter,
    createdAfter,
  });

  const [readIds, deletedIds] = useNotificationStore((state) => [
    state.readNotificationIdsByAccount[address] ?? [],
    state.deletedNotificationIdsByAccount[address] ?? [],
  ]);

  const visibleNotifications = useMemo(() => {
    if (!notifications) {
      return [];
    }
    return notifications.filter((n) => !deletedIds.includes(n.id));
  }, [notifications, deletedIds]);

  const unreadCount = useMemo(
    () => visibleNotifications.filter((n) => !readIds.includes(n.id)).length,
    [visibleNotifications, readIds],
  );

  return {
    visibleNotifications,
    unreadCount,
    categoryFilter,
    setCategoryFilter,
    dateFilter,
    setDateFilter,
  };
};
