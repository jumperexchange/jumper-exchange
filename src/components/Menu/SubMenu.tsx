import CheckIcon from '@mui/icons-material/Check';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type { Breakpoint } from '@mui/material';
import { Box, Typography, useTheme } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import type { KeyboardEvent } from 'react';
import { useEffect, useRef } from 'react';
import {
  ButtonBackArrow,
  MenuHeaderAppBar,
  MenuHeaderAppWrapper,
  MenuHeaderLabel,
  MenuItemLink,
  MenuPaper,
} from 'src/components';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
  type MenuKeys,
} from 'src/const';
import { useUserTracking } from 'src/hooks';
import { useMenuStore } from 'src/stores';
import { EventTrackingTool, type MenuListItem } from 'src/types';
import { MenuItemContainer, MenuLabel } from '.';

interface SubMenuProps {
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

export const SubMenu = ({
  open,
  prevMenu,
  label,
  triggerSubMenu,
  subMenuList,
}: SubMenuProps) => {
  const theme = useTheme();
  const { trackEvent } = useUserTracking();
  const menuListRef = useRef(null);
  const [openSubMenu, onOpenSubMenu] = useMenuStore((state) => [
    state.openSubMenu,
    state.onOpenSubMenu,
  ]);

  function handleBackSpace(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Backspace') {
      onOpenSubMenu(prevMenu);
    }
  }

  const handleClick = (el: MenuListItem) => {
    if (el.triggerSubMenu) {
      onOpenSubMenu(el.triggerSubMenu);
      trackEvent({
        category: TrackingCategory.SubMenu,
        action: TrackingAction.OpenMenu,
        label: `open_submenu_${el.triggerSubMenu.toLowerCase()}`,
        data: {
          [TrackingEventParameter.Menu]: el.triggerSubMenu,
          [TrackingEventParameter.PrevMenu]: prevMenu,
        },
        disableTrackingTool: [
          EventTrackingTool.ARCx,
          EventTrackingTool.Cookie3,
        ],
      });
    } else {
      typeof el.onClick === 'function' && el.onClick();
    }
  };

  const handleBackNavigation = () => {
    onOpenSubMenu(prevMenu);
  };

  useEffect(() => {
    if (menuListRef.current && open && openSubMenu === triggerSubMenu) {
      const menuList: HTMLUListElement = menuListRef.current;
      menuList.scrollTop = 0;
    }
  }, [open, openSubMenu, triggerSubMenu]);

  return open && openSubMenu === triggerSubMenu ? (
    <MenuPaper
      className="submenu"
      onKeyDown={handleBackSpace}
      autoFocus={open}
      component={'ul'}
      ref={menuListRef}
    >
      <MenuHeaderAppWrapper>
        <MenuHeaderAppBar component="div" elevation={0}>
          <ButtonBackArrow
            styles={{ marginLeft: 0 }}
            onClick={handleBackNavigation}
          />
          <MenuHeaderLabel>{label}</MenuHeaderLabel>
        </MenuHeaderAppBar>
      </MenuHeaderAppWrapper>
      {!!subMenuList.length ? (
        subMenuList.map((el, index) =>
          !!el.url ? (
            <MenuItemLink
              autoFocus={index > 0 ? true : false}
              onClick={() => {
                el.triggerSubMenu
                  ? onOpenSubMenu(el.triggerSubMenu)
                  : el.onClick();
              }}
              component="li"
              key={`${el.label}-${index}`}
            >
              <MenuLabel
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
                  ml={!!el.prefixIcon ? theme.spacing(1.5) : 'inherit'}
                  mr={!!el.suffixIcon ? theme.spacing(1.5) : 'inherit'}
                >
                  {`${el.label || ' '}`}
                </Typography>
                {el.suffixIcon}
              </MenuLabel>
            </MenuItemLink>
          ) : (
            <MenuItemContainer
              autoFocus={index > 0 ? true : false}
              onClick={() => handleClick(el)}
              key={`${el.label}-${index}`}
            >
              <MenuLabel
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
                  ml={!!el.prefixIcon ? theme.spacing(1.5) : 'inherit'}
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: 'inherit',
                    [theme.breakpoints.up('sm' as Breakpoint)]: {
                      maxWidth: el.prefixIcon ? 188 : 'inherit',
                    },
                  }}
                >
                  {`${el.label || ' '}`}
                </Typography>
              </MenuLabel>
              {el.checkIcon && <CheckIcon />}
              {el.showMoreIcon ? (
                <ChevronRightIcon sx={{ ml: theme.spacing(1) }} />
              ) : null}
            </MenuItemContainer>
          ),
        )
      ) : (
        <Box textAlign={'center'} mt={theme.spacing(1)}>
          <CircularProgress />
        </Box>
      )}
    </MenuPaper>
  ) : null;
};
