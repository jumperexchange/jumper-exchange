import CheckIcon from '@mui/icons-material/Check';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { Breakpoint, useTheme } from '@mui/material/styles';
import { ButtonBackArrow } from '@transferto/shared/src/atoms/ButtonArrowBack';
import { KeyboardEvent } from 'react';
import { MenuKeys } from '../../const';
import { useMenuStore } from '../../stores/menu';
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
  label: string;
  suffixIcon?: JSX.Element | string;
  prefixIcon?: JSX.Element | string;
  checkIcon?: boolean;
  url?: string;
  prevMenu: MenuKeys;
  subMenuList: MenuListItem[];
  triggerSubMenu: MenuKeys;
}

const SubMenuComponent = ({
  open,
  prevMenu,
  label,
  triggerSubMenu,
  subMenuList,
}: NavbarSubMenuProps) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [openNavbarSubMenu, onOpenNavbarSubMenu] = useMenuStore((state) => [
    state.openNavbarSubMenu,
    state.onOpenNavbarSubMenu,
  ]);

  function handleBackSpace(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Backspace') {
      onOpenNavbarSubMenu(prevMenu);
    }
  }

  return open && openNavbarSubMenu === triggerSubMenu ? (
    <NavbarPaper
      onKeyDown={handleBackSpace}
      autoFocus={open}
      component={'ul'}
      isDarkMode={isDarkMode}
    >
      <MenuHeaderAppWrapper>
        <MenuHeaderAppBar component="div" elevation={0}>
          <ButtonBackArrow
            style={{ marginLeft: '0px' }}
            onClick={() => {
              onOpenNavbarSubMenu(prevMenu);
            }}
          />
          <MenuHeaderLabel>{label}</MenuHeaderLabel>
        </MenuHeaderAppBar>
      </MenuHeaderAppWrapper>
      {!!subMenuList.length ? (
        subMenuList.map((el, index) =>
          !!el.url ? (
            <MenuLinkItem
              autoFocus={index > 0 ? true : false}
              onClick={() => {
                !!el.triggerSubMenu && onOpenNavbarSubMenu(el.triggerSubMenu);
                el.onClick();
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
                  {`${el.label || ' '}`}
                </Typography>
                {el.suffixIcon}
              </MenuItemLabel>
            </MenuLinkItem>
          ) : (
            <MenuItem
              autoFocus={index > 0 ? true : false}
              onClick={() => {
                !!el.triggerSubMenu && onOpenNavbarSubMenu(el.triggerSubMenu);
                el.onClick();
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
                  {`${el.label || ' '}`}
                </Typography>
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
  ) : null;
};

export default SubMenuComponent;
