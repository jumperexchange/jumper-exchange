'use client';

import { useAccount } from '@jumperexchange/wallet-management';
import { useQueryClient } from '@tanstack/react-query';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavbarMenuToggleButton } from '@/components/Navbar/components/Buttons/Buttons.style';
import { notificationsQueryKey } from '@/hooks/notifications/useNotifications';
import {
  notificationsSummaryQueryKey,
  useNotificationsSummary,
} from '@/hooks/notifications/useNotificationsSummary';
import { useNotificationStore } from '@/stores/notifications/NotificationStore';
import { NotificationDrawer } from './NotificationDrawer';
import { NotificationPopover } from './NotificationPopover';
import { BellIcon, NotificationBadge } from './Notifications.style';

export const NotificationBell = () => {
  const { account } = useAccount();
  const { t } = useTranslation();
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const anchorRef = useRef<HTMLButtonElement>(null);
  const previousAddressRef = useRef<string | undefined>(undefined);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const address = account?.address ?? '';
  const { data: summary, isLoading: isSummaryLoading } =
    useNotificationsSummary();
  const [readIds, deletedIds] = useNotificationStore((state) => [
    state.readNotificationIdsByAccount[address] ?? [],
    state.deletedNotificationIdsByAccount[address] ?? [],
  ]);

  // Clear all notification caches when the wallet disconnects so the badge
  // doesn't show a stale count for the next connected account.
  useEffect(() => {
    if (address) {
      previousAddressRef.current = address;
      return;
    }

    const previousAddress = previousAddressRef.current;
    if (!previousAddress) {
      return;
    }

    queryClient.removeQueries({
      queryKey: notificationsSummaryQueryKey(previousAddress),
    });
    queryClient.removeQueries({
      queryKey: notificationsQueryKey(previousAddress),
    });
    previousAddressRef.current = undefined;
  }, [address, queryClient]);

  const badgeContent = Math.max(
    0,
    (summary?.count ?? 0) - readIds.length - deletedIds.length,
  );
  const shouldHideBadge = isSummaryLoading || badgeContent === 0;

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
        badgeContent={badgeContent}
        color="primary"
        invisible={shouldHideBadge}
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
