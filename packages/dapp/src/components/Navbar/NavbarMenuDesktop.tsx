import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton, Typography } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import { useTheme } from '@mui/material/styles';
import { useSettings } from '@transferto/shared/src/hooks';
import { Dispatch, KeyboardEvent, SetStateAction } from 'react';
import { useMenu } from '../../providers/MenuProvider';
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
  label?: string;
  handleClose: (event: MouseEvent | TouchEvent) => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  stickyLabel?: boolean;
  scrollableMainLayer?: boolean;
  open: boolean;
  children: any;
}

const NavbarMenuDesktop = ({
  openSubMenu,
  anchorRef,
  setOpen,
  handleClose,
  stickyLabel,
  scrollableMainLayer,
  label,
  open,
  children,
}: NavbarMenuProps) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const settings = useSettings();
  const menu = useMenu();

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
        <NavbarPopper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          // stickyLabel={stickyLabel}
          placement="bottom-start"
          transition
          disablePortal
        >
          {({ TransitionProps }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: 'right top',
              }}
            >
              <NavbarPaper
                isDarkMode={isDarkMode}
                scrollableMainLayer={scrollableMainLayer}
                openSubMenu={openSubMenu !== 'none'}
                // stickyLabel={stickyLabel}
                isScrollable={true}
              >
                <ClickAwayListener
                  onClickAway={(event) => {
                    handleClose(event);
                    menu.onCloseAllNavbarMenus();
                  }}
                >
                  <NavbarMenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                    isScrollable={!!label}
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
                              menu.onOpenNavbarWalletMenu(
                                !menu.openNavbarWalletMenu,
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
            </Grow>
          )}
        </NavbarPopper>
      </>
    )
  );
};

export default NavbarMenuDesktop;
