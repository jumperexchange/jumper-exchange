'use client';

import ClickAwayListener from '@mui/material/ClickAwayListener';
import Fade from '@mui/material/Fade';
import { type FC, useMemo, useState } from 'react';
import { MenuPopper } from '@/components/Menu/Menu.style';
import { useNotifications } from '@/hooks/notifications/useNotifications';
import { useNotificationStore } from '@/stores/notifications/NotificationStore';
import { ONE_DAY_MS, ONE_WEEK_MS, THIRTY_DAYS_MS } from '@/const/time';
import type { NotificationCategory } from '@/types/notifications';
import { NotificationFilters } from './NotificationFilters';
import { NotificationHeader } from './NotificationHeader';
import { NotificationList } from './NotificationList';
import { NotificationPaper } from './Notifications.style';

export type DateFilter = 'all' | 'today' | 'week' | 'month';

interface NotificationPopoverProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const NotificationPopover: FC<NotificationPopoverProps> = ({
  anchorEl,
  open,
  setOpen,
}) => {
  const handleClose = () => setOpen(false);
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

  return (
    <ClickAwayListener
      touchEvent="onTouchStart"
      mouseEvent="onMouseDown"
      onClickAway={(event) => {
        const target = event.target as HTMLElement | null;
        if (target?.closest('[role="presentation"]')) {
          return;
        }
        setTimeout(() => {
          event.stopPropagation();
          if (open) {
            setOpen(false);
          }
        }, 150);
      }}
    >
      <MenuPopper
        open={open}
        anchorEl={anchorEl}
        transition
        placement="bottom-end"
      >
        {({ TransitionProps }) => (
          <Fade
            {...TransitionProps}
            in={open}
            style={{ transformOrigin: 'top right' }}
          >
            <NotificationPaper>
              <NotificationHeader unreadCount={unreadCount} />
              <NotificationFilters
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
              />
              <NotificationList
                notifications={visibleNotifications}
                onCtaClick={handleClose}
              />
            </NotificationPaper>
          </Fade>
        )}
      </MenuPopper>
    </ClickAwayListener>
  );
};
