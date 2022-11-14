import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
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
interface NavbarMenuProps {
  openSubMenu: string;
  anchorRef: any; // TODO: Replace this any with the correct type
  setOpenSubMenu: Dispatch<SetStateAction<string>>;
  handleClose: (event: MouseEvent | TouchEvent) => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
}

const NavbarMenu = ({
  handleClose,
  open,
  setOpen,
  anchorRef,
  openSubMenu,
  setOpenSubMenu,
}: NavbarMenuProps) => {
  // Dropdown-Menu - Source: https://mui.com/material-ui/react-menu/
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
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-start"
        sx={{
          // TODO: Can we get rid of those !important´s?
          zIndex: 1,
          left: 'unset !important',
          top: 'unset !important',
          right: '1.5rem !important',
          transform: 'unset !important',
        }}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom-start' ? 'left top' : 'left bottom',
            }}
          >
            <Paper
              sx={{
                width: '288px',
                borderRadius: '12px',
                mt: '10px',
                padding: openSubMenu == 'none' ? '16px 0' : 0,
                '& ul': {
                  padding: 0,
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
                  <NavbarMenuItemAbout open={open} openSubMenu={openSubMenu} />
                  <NavbarMenuItemSupport
                    open={open}
                    openSubMenu={openSubMenu}
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
    )
  );
};

export default NavbarMenu;
