import CheckIcon from '@mui/icons-material/Check';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import type { Breakpoint } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import type { KeyboardEvent } from 'react';
import type { MenuKeys } from 'src/const';
import { useMenuStore } from 'src/stores';
import type { MenuListItem } from 'src/types';

import { ButtonBackArrow } from 'src/atoms';
import {
  MenuHeaderAppBar,
  MenuHeaderAppWrapper,
  NavbarPaper,
  PopperHeaderLabel,
  PopperItemContainer,
  PopperItemLabel,
  PopperLinkItem,
} from 'src/components';

interface PopperSubMenuProps {
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

export const PopperSubMenu = ({
  open,
  prevMenu,
  label,
  triggerSubMenu,
  subMenuList,
}: PopperSubMenuProps) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [openPopperSubMenu, onOpenPopperSubMenu] = useMenuStore((state) => [
    state.openPopperSubMenu,
    state.onOpenPopperSubMenu,
  ]);

  function handleBackSpace(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Backspace') {
      onOpenPopperSubMenu(prevMenu);
    }
  }

  return open && openPopperSubMenu === triggerSubMenu ? (
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
              onOpenPopperSubMenu(prevMenu);
            }}
          />
          <PopperHeaderLabel>{label}</PopperHeaderLabel>
        </MenuHeaderAppBar>
      </MenuHeaderAppWrapper>
      {!!subMenuList.length ? (
        subMenuList.map((el, index) =>
          !!el.url ? (
            <PopperLinkItem
              autoFocus={index > 0 ? true : false}
              onClick={() => {
                el.triggerSubMenu
                  ? onOpenPopperSubMenu(el.triggerSubMenu)
                  : el.onClick();
              }}
              component="li"
              key={`${el.label}-${index}`}
            >
              <PopperItemLabel
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
              </PopperItemLabel>
            </PopperLinkItem>
          ) : (
            <PopperItemContainer
              autoFocus={index > 0 ? true : false}
              onClick={() => {
                el.triggerSubMenu
                  ? onOpenPopperSubMenu(el.triggerSubMenu)
                  : el.onClick();
              }}
              key={`${el.label}-${index}`}
            >
              <PopperItemLabel
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
              </PopperItemLabel>
              {el.checkIcon && <CheckIcon />}
              {el.showMoreIcon && (
                <ChevronRightIcon sx={{ ml: theme.spacing(2) }} />
              )}
            </PopperItemContainer>
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
