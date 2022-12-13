import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton, Slide, Typography } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { useTheme } from '@mui/material/styles';
import { useSettings } from '@transferto/shared/src/hooks';
import { Dispatch, KeyboardEvent, SetStateAction } from 'react';
import {
  MenuHeaderAppBar,
  MenuHeaderAppWrapper,
  NavbarExternalBackground,
  NavbarMenuList,
  NavbarPaper,
  NavbarPopper,
} from './Navbar.styled';

interface NavbarMenuProps {
  openSubMenu: string;
  anchorRef: any; // TODO: Replace this any with the correct type
  handleClose: (event: MouseEvent | TouchEvent) => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  stickyLabel?: boolean;
  scrollableMainLayer?: boolean;
  label?: string;
  open: boolean;
  children: any;
}

const NavbarMenuMobile = ({
  stickyLabel,
  handleClose,
  open,
  setOpen,
  anchorRef,
  scrollableMainLayer,
  label,
  openSubMenu,
  children,
}: NavbarMenuProps) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const settings = useSettings();

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
          <NavbarPopper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            placement="bottom-start"
            transition
            disablePortal
          >
            <NavbarPaper
              isDarkMode={isDarkMode}
              openSubMenu={openSubMenu !== 'none'}
              isScrollable={true}
              scrollableMainLayer={scrollableMainLayer}
            >
              <ClickAwayListener
                onClickAway={(event) => {
                  handleClose(event);
                  settings.onCloseAllNavbarMenus();
                }}
              >
                <NavbarMenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                  onKeyDown={handleListKeyDown}
                  isScrollable={true}
                  component={openSubMenu === 'none' ? 'ul' : 'div'}
                >
                  {!!label ? (
                    <MenuHeaderAppWrapper>
                      <MenuHeaderAppBar
                        component="div"
                        elevation={0}
                        scrollableMainLayer={scrollableMainLayer}
                        stickyLabel={stickyLabel}
                      >
                        <IconButton
                          size="medium"
                          aria-label="settings"
                          edge="start"
                          sx={{
                            color: theme.palette.text.primary,
                            position: 'absolute',
                          }}
                          onClick={() => {
                            settings.onOpenNavbarWalletMenu(
                              !settings.openNavbarWalletMenu,
                            );
                          }}
                        >
                          <ArrowBackIcon />
                        </IconButton>
                        <Typography
                          variant={'lifiBodyMediumStrong'}
                          width={'100%'}
                          align={'center'}
                          flex={1}
                          noWrap
                        >
                          {label}
                        </Typography>
                      </MenuHeaderAppBar>
                    </MenuHeaderAppWrapper>
                  ) : null}
                  {children}
                </NavbarMenuList>
              </ClickAwayListener>
            </NavbarPaper>
          </NavbarPopper>
        </Slide>
      </>
    )
  );
};

export default NavbarMenuMobile;
