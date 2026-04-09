'use client';

import { useAccount } from '@lifi/wallet-management';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavbarMenuToggleButton } from '@/components/Navbar/components/Buttons/Buttons.style';
import { useNotifications } from '@/hooks/notifications/useNotifications';
import { useNotificationStore } from '@/stores/notifications/NotificationStore';
import { NotificationPopover } from './NotificationPopover';
import { BellIcon, NotificationBadge } from './Notifications.style';

export const NotificationBell = () => {
  const { account } = useAccount();
  const { t } = useTranslation();
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const { data: notifications } = useNotifications();
  const [readNotificationIds, deletedNotificationIds] = useNotificationStore(
    (state) => [state.readNotificationIds, state.deletedNotificationIds],
  );

  const unreadCount =
    notifications?.filter(
      (n) =>
        !readNotificationIds.includes(n.id) &&
        !deletedNotificationIds.includes(n.id),
    ).length ?? 0;

  const handleToggle = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen((prev) => !prev);
  };

  if (!account?.address) {
    return null;
  }

  return (
    <>
      <NotificationBadge
        badgeContent={unreadCount}
        color="error"
        invisible={unreadCount === 0}
        overlap="circular"
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <NavbarMenuToggleButton
          ref={anchorRef}
          aria-label={t('notifications.aria.openPanel')}
          aria-controls="notifications-popover"
          aria-expanded={open}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <BellIcon />
        </NavbarMenuToggleButton>
      </NotificationBadge>
      {open && (
        <NotificationPopover
          anchorEl={anchorRef.current}
          open={open}
          setOpen={setOpen}
        />
      )}
    </>
  );
};
