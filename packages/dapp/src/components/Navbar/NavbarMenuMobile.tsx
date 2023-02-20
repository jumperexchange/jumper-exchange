import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Slide, Typography } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { useTheme } from '@mui/material/styles';
import { Dispatch, KeyboardEvent, SetStateAction } from 'react';
import { useMenu } from '../../providers/MenuProvider';
import {
  BackArrowButton,
  MenuHeaderAppBar,
  MenuHeaderAppWrapper,
  NavbarExternalBackground,
  NavbarMenuList,
  NavbarPaper,
  NavbarPopper,
} from './Navbar.style';

interface NavbarMenuProps {
  isOpenSubMenu: boolean;
  hideBackArrow?: boolean;
  handleClose: (event: MouseEvent | TouchEvent) => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  isScrollable?: boolean;
  label?: string;
  open: boolean;
  children: any;
}

const NavbarMenuMobile = ({
  isScrollable,
  handleClose,
  open,
  hideBackArrow,
  setOpen,
  label,
  isOpenSubMenu,
  children,
}: NavbarMenuProps) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
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
        <Slide direction="up" in={open} mountOnEnter unmountOnExit>
          <NavbarPopper
            open={open}
            anchorEl={menu.anchorRef.current}
            role={undefined}
            placement="bottom-start"
            transition
            disablePortal
          >
            <NavbarPaper
              isDarkMode={isDarkMode}
              isOpenSubMenu={isOpenSubMenu}
              openSubMenu={menu.openNavbarSubMenu}
              isScrollable={!!label || isScrollable}
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
                  className={
                    isOpenSubMenu ? 'navbar-menu-list open' : 'navbar-menu-list'
                  }
                  component={!!isOpenSubMenu ? 'div' : 'ul'}
                >
                  {!!label ? (
                    <MenuHeaderAppWrapper>
                      <MenuHeaderAppBar
                        component="div"
                        elevation={0}
                        isScrollable={isScrollable}
                      >
                        {!hideBackArrow && (
                          <BackArrowButton
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
                          </BackArrowButton>
                        )}
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
