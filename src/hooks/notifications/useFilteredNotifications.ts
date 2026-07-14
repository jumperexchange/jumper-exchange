import { useAccount } from '@jumperexchange/wallet-management';
import { subDays, subWeeks } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { useNotificationTracking } from '@/hooks/userTracking/useNotificationTracking';
import { useNotificationStore } from '@/stores/notifications/NotificationStore';
import type { NotificationCategory } from '@/types/notifications';
import { isExpired } from '@/utils/notifications/isExpired';
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

  // Funnel start: a notification fetched into the client counts as "received".
  // This is the earliest point we know individual notification ids — the badge
  // summary only carries counts. De-duplication is handled inside the tracker.
  const { trackReceived } = useNotificationTracking();
  useEffect(() => {
    notifications?.forEach(trackReceived);
  }, [notifications, trackReceived]);

  const [readIds, deletedIds] = useNotificationStore((state) => [
    state.readNotificationIdsByAccount[address] ?? [],
    state.deletedNotificationIdsByAccount[address] ?? [],
  ]);

  const visibleNotifications = useMemo(() => {
    if (!notifications) {
      return [];
    }
    return notifications.filter(
      (n) => !deletedIds.includes(n.id) && !isExpired(n),
    );
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
