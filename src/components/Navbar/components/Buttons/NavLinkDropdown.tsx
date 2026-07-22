'use client';

import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Fade from '@mui/material/Fade';
import { type ReactNode, useRef, useState } from 'react';
import { MenuPopper } from '@/components/Menu/Menu.style';
import type { NavDropdownItem } from '../../hooks';
import { LabelButton } from './LabelButton';
import { NavDropdownLinkItem, NavDropdownPaper } from './NavLinkDropdown.style';

interface NavLinkDropdownProps {
  label: ReactNode;
  isActive?: boolean;
  activePathname?: string;
  items: NavDropdownItem[];
  testId?: string;
}

export const NavLinkDropdown = ({
  label,
  isActive,
  activePathname,
  items,
  testId,
}: NavLinkDropdownProps) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  return (
    <Box ref={anchorRef} sx={{ display: 'inline-flex' }}>
      <LabelButton
        isActive={isActive}
        data-testid={testId}
        onClick={() => setOpen((prev) => !prev)}
        label={
          <Box
            component="span"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              paddingLeft: 1.5,
              paddingRight: 1,
            }}
          >
            {label}
            <KeyboardArrowDownRoundedIcon
              sx={{
                fontSize: 18,
                transition: 'transform 0.15s ease',
                transform: open ? 'rotate(180deg)' : 'none',
              }}
            />
          </Box>
        }
      />
      {open && (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <MenuPopper
            open={open}
            anchorEl={anchorRef.current}
            transition
            placement="bottom-start"
          >
            {({ TransitionProps }) => (
              <Fade
                {...TransitionProps}
                in={open}
                style={{ transformOrigin: 'top left' }}
              >
                <NavDropdownPaper>
                  {items.map((item) => (
                    <NavDropdownLinkItem
                      key={item.value}
                      href={item.value}
                      isActive={activePathname === item.value}
                      data-testid={item.testId}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </NavDropdownLinkItem>
                  ))}
                </NavDropdownPaper>
              </Fade>
            )}
          </MenuPopper>
        </ClickAwayListener>
      )}
    </Box>
  );
};
