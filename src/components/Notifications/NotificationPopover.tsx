'use client';

import ClickAwayListener from '@mui/material/ClickAwayListener';
import Fade from '@mui/material/Fade';
import type { FC } from 'react';
import { MenuPopper } from '@/components/Menu/Menu.style';
import { useFilteredNotifications } from '@/hooks/notifications/useFilteredNotifications';
import { NotificationFilters } from './NotificationFilters';
import { NotificationHeader } from './NotificationHeader';
import { NotificationList } from './NotificationList';
import { NotificationPaper } from './Notifications.style';

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
  const {
    visibleNotifications,
    unreadCount,
    categoryFilter,
    setCategoryFilter,
    dateFilter,
    setDateFilter,
  } = useFilteredNotifications();

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
