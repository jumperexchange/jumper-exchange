'use client';

import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FullScreenDrawer } from '@/components/core/FullScreenDrawer/FullScreenDrawer';
import { useFilteredNotifications } from '@/hooks/notifications/useFilteredNotifications';
import { NotificationFilters } from './NotificationFilters';
import { NotificationList } from './NotificationList';
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
  const {
    visibleNotifications,
    unreadCount,
    categoryFilter,
    setCategoryFilter,
    dateFilter,
    setDateFilter,
  } = useFilteredNotifications();

  const handleClose = () => setOpen(false);

  return (
    <FullScreenDrawer
      id="notifications-drawer"
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
