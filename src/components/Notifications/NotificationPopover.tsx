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
  id?: string;
  anchorEl: HTMLElement | null;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const NotificationPopover: FC<NotificationPopoverProps> = ({
  id,
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
        if (!target) {
          return;
        }
        if (anchorEl?.contains(target)) {
          return;
        }
        // MUI Select/Menu portals render outside our DOM tree inside a Modal
        // root with role="presentation".  Only suppress close when that portal
        // actually contains an interactive widget (listbox or menu), which
        // excludes plain Modal backdrops and Dialog overlays.
        const presentationRoot = target.closest('[role="presentation"]');
        if (
          presentationRoot?.querySelector('[role="listbox"], [role="menu"]')
        ) {
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
        id={id}
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
