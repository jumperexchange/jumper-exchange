'use client';

import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded';
import { useAccount } from '@lifi/wallet-management';
import { Stack } from '@mui/material';
import NextLink from 'next/link';
import type { FC, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from '@/components/Badge/Badge.styles';
import { IconButton } from '@/components/core/buttons/IconButton/IconButton';
import { Variant, Size } from '@/components/core/buttons/types';
import { useNotificationStore } from '@/stores/notifications/NotificationStore';
import type { Notification, NotificationCategory } from '@/types/notifications';
import {
  CtaLink,
  NotificationBody,
  NotificationContent,
  NotificationFooter,
  NotificationItemContainer,
  NotificationTitle,
  UnreadDot,
} from './Notifications.style';

// TODO: Think about color mapping the categories
const CATEGORY_BADGE_VARIANT: Record<NotificationCategory, BadgeVariant> = {
  earn: BadgeVariant.Secondary,
  product: BadgeVariant.Secondary,
  campaign: BadgeVariant.Secondary,
  portfolio: BadgeVariant.Secondary,
};

interface NotificationItemProps {
  notification: Notification;
  onCtaClick: () => void;
  alwaysShowDelete?: boolean;
}

export const NotificationItem: FC<NotificationItemProps> = ({
  notification,
  onCtaClick,
  alwaysShowDelete,
}) => {
  const { t } = useTranslation();
  const { account } = useAccount();
  const address = account?.address ?? '';
  const [readIds, markAsRead, deleteNotif] = useNotificationStore((state) => [
    state.readNotificationIdsByAccount[address] ?? [],
    state.markAsRead,
    state.deleteNotification,
  ]);

  const isRead = readIds.includes(notification.id);
  const isInternal =
    notification.ctaUrl.startsWith('/') &&
    !notification.ctaUrl.startsWith('//');

  const handleClick = () => {
    if (!isRead) {
      markAsRead(address, notification.id);
    }
  };

  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation();
    deleteNotif(address, notification.id);
  };

  const handleCtaClick = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (!isRead) {
      markAsRead(address, notification.id);
    }
    onCtaClick();
  };

  return (
    <NotificationItemContainer onClick={handleClick} isRead={isRead}>
      <UnreadDot sx={{ visibility: isRead ? 'hidden' : 'visible' }} />
      <NotificationContent>
        <NotificationTitle>{notification.title}</NotificationTitle>
        <Stack
          direction="row"
          sx={{
            gap: 1,
          }}
        >
          <Badge
            label={t(`notifications.categories.${notification.category}`)}
            variant={CATEGORY_BADGE_VARIANT[notification.category]}
            size={BadgeSize.SM}
          />
          <Badge
            variant={BadgeVariant.Alpha}
            label={t('format.shortDate', {
              value: new Date(notification.createdAt),
            })}
          />
        </Stack>

        <NotificationBody title={notification.body}>
          {notification.body}
        </NotificationBody>

        <NotificationFooter>
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
      <IconButton
        className="notification-trash"
        variant={Variant.Borderless}
        size={Size.SM}
        aria-label={t('notifications.aria.deleteNotification')}
        onClick={handleDelete}
        sx={{
          position: 'absolute',
          top: (theme) => theme.spacing(1.5),
          right: (theme) => theme.spacing(1.5),
          opacity: alwaysShowDelete ? 1 : 0,
          transition: 'opacity 0.15s ease',
        }}
      >
        <DeleteOutlineRounded />
      </IconButton>
    </NotificationItemContainer>
  );
};
