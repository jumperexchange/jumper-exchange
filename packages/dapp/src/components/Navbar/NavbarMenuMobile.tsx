import { Slide } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import { useTheme } from '@mui/material/styles';
import { Dispatch, KeyboardEvent, SetStateAction } from 'react';
import { useIsDarkMode } from '../../providers/ThemeProvider';
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

const NavbarMenuMobile = ({
  handleClose,
  open,
  setOpen,
  anchorRef,
  openSubMenu,
  setOpenSubMenu,
}: NavbarMenuProps) => {
  const theme = useTheme();
  const isDarkMode = useIsDarkMode();
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
        <Slide direction="up" in={open} mountOnEnter unmountOnExit>
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            placement="bottom-start"
            sx={{
              // TODO: Can we get rid of those !important´s?
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
            <Paper
              sx={{
                background: isDarkMode ? '#121212' : '#fff',
                borderRadius: '12px 12px 0 0',
                padding: openSubMenu === 'none' ? '24px' : 0,
                mt: '10px',
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
                    setOpen={setOpen}
                    openSubMenu={openSubMenu}
                  />
                  <NavbarMenuItemSupport
                    setOpen={setOpen}
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
          </Popper>
        </Slide>
      </>
    )
  );
};

export default NavbarMenuMobile;
