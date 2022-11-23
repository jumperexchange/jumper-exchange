import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import { useTheme } from '@mui/material/styles';
import { Dispatch, KeyboardEvent, SetStateAction } from 'react';
import {
  NavbarMenuItemAbout,
  NavbarMenuItemDevelopers,
  NavbarMenuItemLanguage,
  NavbarMenuItemSupport,
  NavbarMenuItemThemes,
  NavbarSubMenuDevelopers,
  NavbarSubMenuLanguages,
  NavbarSubMenuThemes,
} from './index';
import { NavbarExternalBackground } from './Navbar.styled';
interface NavbarMenuProps {
  openSubMenu: string;
  anchorRef: any; // TODO: Replace this any with the correct type
  setOpenSubMenu: Dispatch<SetStateAction<string>>;
  handleClose: (event: MouseEvent | TouchEvent) => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
}

const NavbarMenuDesktop = ({
  handleClose,
  open,
  setOpen,
  anchorRef,
  openSubMenu,
  setOpenSubMenu,
}: NavbarMenuProps) => {
  const theme = useTheme();

  function handleListKeyDown(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    !!open && (
      <>
        <NavbarExternalBackground />
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-start"
          sx={{
            zIndex: 2,
            bottom: '0 !important',
            left: '0 !important',
            top: 'unset !important',
            right: '0 !important',
            margin: '0px',
            [theme.breakpoints.up('sm')]: {
              bottom: 'unset !important',
              left: 'unset !important',
              top: 'unset !important',
              right: '1.5rem !important',
              transform: 'unset !important',
            },
          }}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: 'bottom',
              }}
            >
              <Paper
                sx={{
                  borderRadius: '12px',
                  mt: '10px',
                  padding: openSubMenu == 'none' ? '16px 0' : 0,
                  '& ul': {
                    padding: 0,
                  },
                  width: '100%',
                  transformOrigin: 'bottom',
                  transition:
                    'opacity 307ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 204ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',

                  [theme.breakpoints.up('sm')]: {
                    width: '288px',
                  },
                }}
              >
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                  >
                    <NavbarMenuItemLanguage
                      open={open}
                      openSubMenu={openSubMenu}
                      setOpenSubMenu={setOpenSubMenu}
                    />

                    <NavbarMenuItemThemes
                      open={open}
                      openSubMenu={openSubMenu}
                      setOpenSubMenu={setOpenSubMenu}
                    />
                    <NavbarMenuItemDevelopers
                      open={open}
                      openSubMenu={openSubMenu}
                      setOpenSubMenu={setOpenSubMenu}
                    />
                    <NavbarMenuItemAbout
                      open={open}
                      openSubMenu={openSubMenu}
                      setOpen={setOpen}
                    />
                    <NavbarMenuItemSupport
                      open={open}
                      openSubMenu={openSubMenu}
                      setOpen={setOpen}
                    />
                    <NavbarSubMenuThemes
                      open={open}
                      openSubMenu={openSubMenu}
                      setOpenSubMenu={setOpenSubMenu}
                    />
                    <NavbarSubMenuLanguages
                      open={open}
                      openSubMenu={openSubMenu}
                      setOpenSubMenu={setOpenSubMenu}
                    />
                    <NavbarSubMenuDevelopers
                      open={open}
                      openSubMenu={openSubMenu}
                      setOpenSubMenu={setOpenSubMenu}
                    />
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </>
    )
  );
};

export default NavbarMenuDesktop;
