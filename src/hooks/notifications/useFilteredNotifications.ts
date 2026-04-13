import { useMemo, useState } from 'react';
import { ONE_DAY_MS, ONE_WEEK_MS, THIRTY_DAYS_MS } from '@/const/time';
import { useNotificationStore } from '@/stores/notifications/NotificationStore';
import type { NotificationCategory } from '@/types/notifications';
import { useNotifications } from './useNotifications';

export type DateFilter = 'all' | 'today' | 'week' | 'month';

export const useFilteredNotifications = () => {
  const [categoryFilter, setCategoryFilter] =
    useState<NotificationCategory | null>(null);
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');

  const { data: notifications } = useNotifications();
  const [readNotificationIds, deletedNotificationIds] = useNotificationStore(
    (state) => [state.readNotificationIds, state.deletedNotificationIds],
  );

  const visibleNotifications = useMemo(() => {
    if (!notifications) {
      return [];
    }

    const now = Date.now();
    return notifications.filter((n) => {
      if (deletedNotificationIds.includes(n.id)) {
        return false;
      }

      if (categoryFilter && n.category !== categoryFilter) {
        return false;
      }

      if (dateFilter !== 'all') {
        const createdAt = new Date(n.createdAt).getTime();
        const msAgo = now - createdAt;
        if (dateFilter === 'today' && msAgo > ONE_DAY_MS) {
          return false;
        }
        if (dateFilter === 'week' && msAgo > ONE_WEEK_MS) {
          return false;
        }
        if (dateFilter === 'month' && msAgo > THIRTY_DAYS_MS) {
          return false;
        }
      }

      return true;
    });
  }, [notifications, deletedNotificationIds, categoryFilter, dateFilter]);

  const unreadCount = useMemo(
    () =>
      visibleNotifications.filter((n) => !readNotificationIds.includes(n.id))
        .length,
    [visibleNotifications, readNotificationIds],
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
