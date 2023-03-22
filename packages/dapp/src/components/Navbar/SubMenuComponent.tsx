import CheckIcon from '@mui/icons-material/Check';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { Breakpoint, useTheme } from '@mui/material/styles';
import { ButtonBackArrow } from '@transferto/shared/src/atoms/ButtonArrowBack';
import { Dispatch, SetStateAction } from 'react';
import { SubMenuKeys } from '../../const';
import { useMenu } from '../../providers/MenuProvider';
import { MenuListItem } from '../../types';
import {
  MenuHeaderAppBar,
  MenuHeaderAppWrapper,
  MenuHeaderLabel,
  MenuItem,
  MenuItemLabel,
  MenuLinkItem,
  NavbarPaper,
} from './Navbar.style';

interface NavbarSubMenuProps {
  open: boolean;
  isOpenSubMenu: boolean;
  setOpenSubMenu: Dispatch<SetStateAction<string>>;
  isSubMenu: boolean;
  label: string;
  suffixIcon?: JSX.Element | string;
  prefixIcon?: JSX.Element | string;
  checkIcon?: boolean;
  isScrollable?: boolean;
  url?: string;
  subMenuList: MenuListItem[];
  triggerSubMenu: string;
}

const SubMenuComponent = ({
  open,
  isOpenSubMenu,
  setOpenSubMenu,
  isSubMenu,
  isScrollable,
  label,
  triggerSubMenu,
  subMenuList,
}: NavbarSubMenuProps) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const menu = useMenu();

  return (
    !!open && (
      <>
        {menu.openNavbarSubMenu === triggerSubMenu && (
          <NavbarPaper
            component={'ul'}
            isSubMenu={isSubMenu}
            openSubMenu={menu.openNavbarSubMenu}
            isOpenSubMenu={isOpenSubMenu}
            isScrollable={isScrollable}
            isDarkMode={isDarkMode}
          >
            <MenuHeaderAppWrapper>
              <MenuHeaderAppBar
                component="div"
                elevation={0}
                isScrollable={!!label || isScrollable}
              >
                <>
                  <ButtonBackArrow
                    style={{ marginLeft: '0px' }}
                    onClick={() => {
                      setOpenSubMenu(SubMenuKeys.none);
                    }}
                  />
                  <MenuHeaderLabel>{label}</MenuHeaderLabel>
                </>
              </MenuHeaderAppBar>
            </MenuHeaderAppWrapper>
            {!!subMenuList.length ? (
              subMenuList.map((el, index) =>
                !!el.url ? (
                  <MenuLinkItem
                    onClick={() => {
                      !!el.triggerSubMenu && setOpenSubMenu(el.triggerSubMenu);
                      !!el.onClick && el.onClick();
                    }}
                    component="li"
                    key={`${el.label}-${index}`}
                  >
                    <MenuItemLabel
                      variant={
                        !el.suffixIcon && !el.checkIcon && !el.showMoreIcon
                          ? 'lg'
                          : (el.showMoreIcon || el.checkIcon) && el.suffixIcon
                          ? 'xs'
                          : 'md'
                      }
                    >
                      <>
                        {el.prefixIcon}
                        <Typography
                          sx={{
                            maxWidth: 'inherit',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                          variant={'lifiBodyMedium'}
                          ml={!!el.prefixIcon ? '12px' : 'inherit'}
                          mr={!!el.suffixIcon ? '12px' : 'inherit'}
                        >
                          {el.label}
                        </Typography>
                        {el.suffixIcon}
                      </>
                    </MenuItemLabel>
                  </MenuLinkItem>
                ) : (
                  <MenuItem
                    isScrollable={isScrollable}
                    onClick={() => {
                      !!el.triggerSubMenu && setOpenSubMenu(el.triggerSubMenu);
                      !!el.onClick && el.onClick();
                    }}
                    key={`${el.label}-${index}`}
                  >
                    <MenuItemLabel
                      variant={
                        !el.suffixIcon && !el.checkIcon && !el.showMoreIcon
                          ? 'lg'
                          : (el.showMoreIcon || el.checkIcon) && el.suffixIcon
                          ? 'xs'
                          : 'md'
                      }
                    >
                      <>
                        {el.prefixIcon}
                        <Typography
                          variant={'lifiBodyMedium'}
                          ml={!!el.prefixIcon ? '12px' : 'inherit'}
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: 'inherit',
                            [theme.breakpoints.up('sm' as Breakpoint)]: {
                              maxWidth: el.prefixIcon ? '188px' : 'inherit',
                            },
                          }}
                        >
                          {el.label}
                        </Typography>
                      </>
                    </MenuItemLabel>
                    {el.checkIcon && <CheckIcon />}
                    {el.showMoreIcon && (
                      <ChevronRightIcon sx={{ ml: theme.spacing(2) }} />
                    )}
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
