import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Typography } from '@mui/material';
import { Breakpoint, useTheme } from '@mui/material/styles';
import { ButtonPrimary } from '@transferto/shared/src/atoms/index';
import { MenuKeys, TrackingActions, TrackingCategories } from '../../const';
import { useUserTracking } from '../../hooks';
import { useMenuStore } from '../../stores';
import { EventTrackingTool } from '../../types';
import { MenuItem, MenuItemLabel } from './Navbar.style';
interface MenuItemProps {
  open: boolean;
  showButton: boolean;
  autoFocus?: boolean;
  showMoreIcon?: boolean;
  label: string;
  onClick: any;
  triggerSubMenu?: MenuKeys;
  prefixIcon?: JSX.Element | string;
  suffixIcon?: JSX.Element | string;
  checkIcon?: boolean;
}

const MenuItemComponent = ({
  open,
  showButton,
  autoFocus,
  showMoreIcon = true,
  onClick,
  label,
  triggerSubMenu,
  prefixIcon,
  suffixIcon,
}: MenuItemProps) => {
  const theme = useTheme();
  const { trackEvent } = useUserTracking();
  const [onOpenNavbarSubMenu] = useMenuStore((state) => [
    state.onOpenNavbarSubMenu,
  ]);

  return open ? (
    <MenuItem
      disableRipple={showButton}
      showButton={showButton || false}
      autoFocus={autoFocus}
      onClick={() => {
        !!triggerSubMenu && onOpenNavbarSubMenu(triggerSubMenu);
        !!triggerSubMenu &&
          trackEvent({
            category: TrackingCategories.Menu,
            action: TrackingActions.OpenSubmenu,
            label: triggerSubMenu,
            data: { subMenu: triggerSubMenu },
            disableTrackingTool: [
              EventTrackingTool.Raleon,
              EventTrackingTool.ARCx,
            ],
          });
        !!onClick && onClick();
      }}
    >
      <>
        {showButton ? (
          <ButtonPrimary fullWidth>
            {prefixIcon}
            <Typography
              variant={'lifiBodyMediumStrong'}
              component={'span'}
              ml={!!prefixIcon ? '9.5px' : 'inherit'}
              mr={!!prefixIcon ? '9.5px' : 'inherit'}
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '208px',
                [theme.breakpoints.up('sm' as Breakpoint)]: {
                  maxWidth: '168px',
                },
              }}
            >
              {label}
            </Typography>
            {suffixIcon}
          </ButtonPrimary>
        ) : (
          <>
            <MenuItemLabel
              variant={
                suffixIcon && showMoreIcon
                  ? 'xs'
                  : !suffixIcon && !showMoreIcon
                  ? 'lg'
                  : 'md'
              }
            >
              {prefixIcon}
              <Typography
                variant={'lifiBodyMedium'}
                ml={'12px'}
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  [theme.breakpoints.up('sm' as Breakpoint)]: {
                    maxWidth: prefixIcon ? '188px' : 'inherit',
                  },
                }}
              >
                {label}
              </Typography>
            </MenuItemLabel>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {suffixIcon}
              {showMoreIcon && (
                <ChevronRightIcon sx={{ ml: theme.spacing(2) }} />
              )}
            </div>
          </>
        )}
      </>
    </MenuItem>
  ) : null;
};

export default MenuItemComponent;
