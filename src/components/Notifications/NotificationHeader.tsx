import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  NotificationHeaderContainer,
  NotificationHeaderSubtitle,
  NotificationHeaderTitle,
} from './Notifications.style';

interface NotificationHeaderProps {
  unreadCount: number;
}

export const NotificationHeader: FC<NotificationHeaderProps> = ({
  unreadCount,
}) => {
  const { t } = useTranslation();

  return (
    <NotificationHeaderContainer>
      <NotificationHeaderTitle>
        {t('notifications.title')}
      </NotificationHeaderTitle>
      <NotificationHeaderSubtitle>
        {t('notifications.unread', { count: unreadCount })}
      </NotificationHeaderSubtitle>
    </NotificationHeaderContainer>
  );
};
