'use client';

import { useAccount } from '@lifi/wallet-management';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavbarMenuToggleButton } from '@/components/Navbar/components/Buttons/Buttons.style';
import { useNotifications } from '@/hooks/notifications/useNotifications';
import { useNotificationStore } from '@/stores/notifications/NotificationStore';
import { NotificationDrawer } from './NotificationDrawer';
import { NotificationPopover } from './NotificationPopover';
import { BellIcon, NotificationBadge } from './Notifications.style';

export const NotificationBell = () => {
  const { account } = useAccount();
  const { t } = useTranslation();
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const address = account?.address ?? '';
  const { data: notifications } = useNotifications();
  const [readIds, deletedIds] = useNotificationStore((state) => [
    state.readNotificationIdsByAccount[address] ?? [],
    state.deletedNotificationIdsByAccount[address] ?? [],
  ]);

  const unreadCount =
    notifications?.filter(
      (n) => !readIds.includes(n.id) && !deletedIds.includes(n.id),
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
        color="primary"
        invisible={unreadCount === 0}
        overlap="circular"
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <NavbarMenuToggleButton
          ref={anchorRef}
          aria-label={t('notifications.aria.openPanel')}
          {...(isDesktop
            ? {
                'aria-controls': 'notifications-popover',
                'aria-expanded': open,
                'aria-haspopup': 'true' as const,
              }
            : {
                'aria-controls': 'notifications-drawer',
                'aria-expanded': open,
                'aria-haspopup': 'dialog' as const,
              })}
          onClick={handleToggle}
        >
          <BellIcon />
        </NavbarMenuToggleButton>
      </NotificationBadge>
      {isDesktop ? (
        open && (
          <NotificationPopover
            id="notifications-popover"
            anchorEl={anchorRef.current}
            open={open}
            setOpen={setOpen}
          />
        )
      ) : (
        <NotificationDrawer open={open} setOpen={setOpen} />
      )}
    </>
  );
};
