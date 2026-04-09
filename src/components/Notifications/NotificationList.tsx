import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { Notification } from '@/types/notifications';
import { NotificationItem } from './NotificationItem';
import { EmptyState, NotificationListContainer } from './Notifications.style';

interface NotificationListProps {
  notifications: Notification[];
  onCtaClick: () => void;
}

export const NotificationList: FC<NotificationListProps> = ({
  notifications,
  onCtaClick,
}) => {
  const { t } = useTranslation();

  if (notifications.length === 0) {
    return <EmptyState>{t('notifications.emptyState')}</EmptyState>;
  }

  return (
    <NotificationListContainer>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onCtaClick={onCtaClick}
        />
      ))}
    </NotificationListContainer>
  );
};
