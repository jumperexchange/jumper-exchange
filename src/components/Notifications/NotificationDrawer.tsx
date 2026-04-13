'use client';

import { type FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FullScreenDrawer } from '@/components/core/FullScreenDrawer/FullScreenDrawer';
import { ONE_DAY_MS, ONE_WEEK_MS, THIRTY_DAYS_MS } from '@/const/time';
import { useNotifications } from '@/hooks/notifications/useNotifications';
import { useNotificationStore } from '@/stores/notifications/NotificationStore';
import type { NotificationCategory } from '@/types/notifications';
import { NotificationFilters } from './NotificationFilters';
import { NotificationList } from './NotificationList';
import type { DateFilter } from './NotificationPopover';
import { NotificationHeaderSubtitle } from './Notifications.style';

interface NotificationDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const NotificationDrawer: FC<NotificationDrawerProps> = ({
  open,
  setOpen,
}) => {
  const { t } = useTranslation();
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

  const handleClose = () => setOpen(false);

  return (
    <FullScreenDrawer
      isOpen={open}
      onClose={handleClose}
      title={t('notifications.title')}
      contentSx={{ gap: 0, pb: 0, px: 0 }}
      headerSx={{ mx: (theme) => theme.spacing(2) }}
    >
      <NotificationHeaderSubtitle sx={{ textAlign: 'center' }}>
        {t('notifications.unread', { count: unreadCount })}
      </NotificationHeaderSubtitle>
      <NotificationFilters
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        sx={{ mt: (theme) => theme.spacing(2), justifyContent: 'center' }}
      />
      <NotificationList
        notifications={visibleNotifications}
        onCtaClick={handleClose}
        alwaysShowDelete
      />
    </FullScreenDrawer>
  );
};
