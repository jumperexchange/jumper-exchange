import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Dispatch, SetStateAction } from 'react';
// import {default as NavbarTabsContainer} from './NavbarTabsContainer'
import CheckIcon from '@mui/icons-material/Check';
import { Box, IconButton, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import { MenuListItem } from '../../types';
import {
  MenuHeaderAppBar,
  MenuHeaderAppWrapper,
  MenuItem,
  MenuItemLabel,
  MenuLinkItem,
  NavbarPaper,
} from './Navbar.styled';

interface NavbarSubMenuProps {
  open: boolean;
  openSubMenu: string;
  setOpenSubMenu: Dispatch<SetStateAction<string>>;
  isSubMenu: boolean;
  label: string;
  listIcon?: JSX.Element;
  checkIcon?: boolean;
  stickyLabel?: boolean;
  url?: string;
  subMenuList: MenuListItem[];
  triggerSubMenu: string;
}

const SubMenuComponent = ({
  open,
  openSubMenu,
  setOpenSubMenu,
  isSubMenu,
  stickyLabel,
  label,
  triggerSubMenu,
  subMenuList,
}: NavbarSubMenuProps) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    !!open && (
      <>
        {openSubMenu === triggerSubMenu && (
          <NavbarPaper
            component="ul"
            isSubMenu={isSubMenu}
            stickyLabel={stickyLabel}
            isDarkMode={isDarkMode}
          >
            <MenuHeaderAppWrapper>
              <MenuHeaderAppBar
                component="div"
                elevation={0}
                stickyLabel={!!label}
              >
                <>
                  <IconButton
                    size="medium"
                    aria-label="settings"
                    edge="start"
                    sx={{
                      color: theme.palette.text.primary,
                      position: 'absolute',
                    }}
                    onClick={() => {
                      setOpenSubMenu('none');
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
                    <>{label}</>
                  </Typography>
                </>
              </MenuHeaderAppBar>
            </MenuHeaderAppWrapper>
            {!!subMenuList.length ? (
              subMenuList.map((el, index) =>
                !!el.url ? (
                  <MenuLinkItem
                    onClick={() => {
                      el.onClick();
                    }}
                    component="li"
                    key={`${el.label}-${index}`}
                  >
                    <MenuItemLabel>
                      <>
                        {el.listIcon}
                        <Typography
                          variant={'lifiBodyMedium'}
                          ml={!!el.listIcon ? '12px' : 'inherit'}
                        >
                          <>{el.label}</>
                        </Typography>
                      </>
                    </MenuItemLabel>
                  </MenuLinkItem>
                ) : (
                  <MenuItem
                    stickyLabel={stickyLabel}
                    onClick={() => {
                      el.onClick();
                    }}
                    key={`${el.label}-${index}`}
                  >
                    <MenuItemLabel>
                      <>
                        {el.listIcon}
                        <Typography
                          variant={'lifiBodyMedium'}
                          ml={!!el.listIcon ? '12px' : 'inherit'}
                        >
                          <>{el.label}</>
                        </Typography>
                      </>
                    </MenuItemLabel>
                    {el.checkIcon && <CheckIcon />}
                  </MenuItem>
                ),
              )
            ) : (
              <Box textAlign={'center'} mt={theme.spacing(2)}>
                <CircularProgress />
              </Box>
            )}
          </NavbarPaper>
        )}
      </>
    )
  );
};

export default SubMenuComponent;
