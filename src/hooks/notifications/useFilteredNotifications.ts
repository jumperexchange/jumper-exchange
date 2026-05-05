import { useAccount } from '@lifi/wallet-management';
import { subDays, subWeeks } from 'date-fns';
import { useMemo, useState } from 'react';
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
  const now = new Date();
  const fnMap: Record<Exclude<DateFilter, 'all'>, () => Date> = {
    today: () => subDays(now, 1),
    week: () => subWeeks(now, 1),
    month: () => subDays(now, 30),
  };
  return fnMap[dateFilter]().toISOString();
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
