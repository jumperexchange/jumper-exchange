'use client';

import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded';
import NextLink from 'next/link';
import type { FC, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from '@/components/Badge/Badge.styles';
import { useNotificationStore } from '@/stores/notifications/NotificationStore';
import type { Notification, NotificationCategory } from '@/types/notifications';
import {
  CtaLink,
  NotificationBody,
  NotificationContent,
  NotificationDate,
  NotificationFooter,
  NotificationItemContainer,
  NotificationTitle,
  TrashButton,
  UnreadDot,
} from './Notifications.style';

const CATEGORY_BADGE_VARIANT: Record<NotificationCategory, BadgeVariant> = {
  earn: BadgeVariant.Success,
  product: BadgeVariant.Primary,
  campaign: BadgeVariant.Tertiary,
  portfolio: BadgeVariant.Warning,
};

interface NotificationItemProps {
  notification: Notification;
  onCtaClick: () => void;
}

export const NotificationItem: FC<NotificationItemProps> = ({
  notification,
  onCtaClick,
}) => {
  const { t } = useTranslation();
  const [readNotificationIds, markAsRead, deleteNotification] =
    useNotificationStore((state) => [
      state.readNotificationIds,
      state.markAsRead,
      state.deleteNotification,
    ]);

  const isRead = readNotificationIds.includes(notification.id);
  const isInternal = notification.ctaUrl.startsWith('/');

  const handleClick = () => {
    if (!isRead) {
      markAsRead(notification.id);
    }
  };

  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation();
    deleteNotification(notification.id);
  };

  const handleCtaClick = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (!isRead) {
      markAsRead(notification.id);
    }
    onCtaClick();
  };

  return (
    <NotificationItemContainer onClick={handleClick}>
      {!isRead ? <UnreadDot /> : <UnreadDot sx={{ visibility: 'hidden' }} />}

      <NotificationContent>
        <NotificationTitle>{notification.title}</NotificationTitle>
        <NotificationDate>
          {t('format.shortDate', {
            value: new Date(notification.createdAt),
          })}
        </NotificationDate>

        <NotificationBody title={notification.body}>
          {notification.body}
        </NotificationBody>

        <NotificationFooter>
          <Badge
            label={t(`notifications.categories.${notification.category}`)}
            variant={CATEGORY_BADGE_VARIANT[notification.category]}
            size={BadgeSize.SM}
          />
          {notification.ctaUrl &&
            notification.ctaLabel &&
            (isInternal ? (
              <CtaLink
                as={NextLink}
                href={notification.ctaUrl}
                onClick={handleCtaClick}
              >
                {notification.ctaLabel}
                <OpenInNewRounded />
              </CtaLink>
            ) : (
              <CtaLink
                href={notification.ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCtaClick}
              >
                {notification.ctaLabel}
                <OpenInNewRounded />
              </CtaLink>
            ))}
        </NotificationFooter>
      </NotificationContent>

      <TrashButton
        className="notification-trash"
        aria-label={t('notifications.aria.deleteNotification')}
        onClick={handleDelete}
        size="small"
      >
        <DeleteOutlineRounded fontSize="small" />
      </TrashButton>
    </NotificationItemContainer>
  );
};
