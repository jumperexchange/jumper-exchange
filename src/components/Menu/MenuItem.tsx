import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type { Breakpoint, CSSObject } from '@mui/material';
import { Typography, useTheme } from '@mui/material';
import { Button } from 'src/components';
import type { MenuKeys } from 'src/const';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const';
import { useUserTracking } from 'src/hooks';
import { useMenuStore } from 'src/stores';
import { EventTrackingTool } from 'src/types';
import type { JsxElement } from 'typescript';
import { MenuItemContainer, MenuLabel } from '.';

interface MenuItemProps {
  open: boolean;
  showButton: boolean | undefined;
  children?: Element | JsxElement | undefined;
  disableRipple?: boolean | undefined;
  autoFocus?: boolean;
  showMoreIcon?: boolean;
  styles?: CSSObject;
  label?: string;
  onClick: any;
  triggerSubMenu?: MenuKeys;
  prefixIcon?: JSX.Element | string;
  suffixIcon?: JSX.Element | string;
  checkIcon?: boolean;
}

export const MenuItem = ({
  open,
  showButton,
  autoFocus,
  disableRipple,
  children,
  showMoreIcon = true,
  styles,
  onClick,
  label,
  triggerSubMenu,
  prefixIcon,
  suffixIcon,
}: MenuItemProps) => {
  const theme = useTheme();
  const { trackEvent } = useUserTracking();
  const [onOpenSubMenu] = useMenuStore((state) => [state.onOpenSubMenu]);

  const handleClick = () => {
    triggerSubMenu && onOpenSubMenu(triggerSubMenu);
    triggerSubMenu &&
      trackEvent({
        category: TrackingCategory.MainMenu,
        action: TrackingAction.OpenMenu,
        label: `open_submenu_${triggerSubMenu.toLowerCase()}`,
        data: { [TrackingEventParameter.Menu]: triggerSubMenu },
        disableTrackingTool: [
          EventTrackingTool.ARCx,
          EventTrackingTool.Cookie3,
        ],
      });
    !!onClick && onClick();
  };

  return open ? (
    <MenuItemContainer
      disableRipple={disableRipple || showButton}
      showButton={showButton || false}
      sx={styles}
      autoFocus={autoFocus}
      onClick={() => {
        !children && handleClick();
      }}
    >
      <>
        {children}
        {showButton && (
          <Button variant="primary" styles={styles} fullWidth={true}>
            {prefixIcon}
            <Typography
              variant={'lifiBodyMediumStrong'}
              component={'span'}
              ml={!!prefixIcon ? '9.5px' : 'inherit'}
              mr={!!prefixIcon ? '9.5px' : 'inherit'}
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: 208,
                [theme.breakpoints.up('sm' as Breakpoint)]: {
                  maxWidth: 168,
                },
              }}
            >
              {label}
            </Typography>
            {suffixIcon ?? null}
          </Button>
        )}
        {!showButton && (
          <>
            <MenuLabel
              variant={
                suffixIcon && showMoreIcon
                  ? 'xs'
                  : !suffixIcon && !showMoreIcon
                    ? 'lg'
                    : 'md'
              }
            >
              {prefixIcon ?? null}
              {label ? (
                <Typography
                  variant={'lifiBodyMedium'}
                  ml={theme.spacing(1.5)}
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    [theme.breakpoints.up('sm' as Breakpoint)]: {
                      maxWidth: prefixIcon ? 188 : 'inherit',
                    },
                  }}
                >
                  {label}
                </Typography>
              ) : null}
            </MenuLabel>
            {suffixIcon || showMoreIcon ? (
              <div
                style={{
                  display: suffixIcon || showMoreIcon ? 'flex' : 'none',
                  alignItems: 'center',
                }}
              >
                {suffixIcon ?? null}
                {showMoreIcon ? (
                  <ChevronRightIcon sx={{ ml: theme.spacing(1) }} />
                ) : null}
              </div>
            ) : null}
          </>
        )}
      </>
    </MenuItemContainer>
  ) : null;
};
