import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Typography } from '@mui/material';
import { Breakpoint, useTheme } from '@mui/material/styles';
import { ButtonPrimary } from '@transferto/shared/src/atoms/index';
import {
  MenuKeys,
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '../../const';
import { useUserTracking } from '../../hooks';
import { useMenuStore } from '../../stores';
import { EventTrackingTool } from '../../types';
import { MenuItem, MenuItemLabel } from './Navbar.style';
interface MenuItemProps {
  open: boolean;
  showButton: boolean;
  autoFocus?: boolean;
  showMoreIcon?: boolean;
  cardsLayout?: boolean;
  label?: string;
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
  cardsLayout,
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

  const handleClick = () => {
    !!triggerSubMenu && onOpenNavbarSubMenu(triggerSubMenu);
    !!triggerSubMenu &&
      trackEvent({
        category: TrackingCategory.MainMenu,
        action: TrackingAction.OpenMenu,
        label: `open_submenu_${triggerSubMenu.toLowerCase()}`,
        data: { [TrackingEventParameter.Menu]: triggerSubMenu },
        disableTrackingTool: [EventTrackingTool.Raleon, EventTrackingTool.ARCx],
      });
    !!onClick && onClick();
  };

  return open ? (
    <MenuItem
      disableRipple={showButton}
      showButton={showButton || false}
      cardsLayout={cardsLayout || false}
      autoFocus={autoFocus}
      onClick={handleClick}
    >
      <>
        {showButton && label ? (
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
              cardsLayout={cardsLayout}
              variant={
                suffixIcon && showMoreIcon
                  ? 'xs'
                  : !suffixIcon && !showMoreIcon
                  ? 'lg'
                  : 'md'
              }
            >
              {prefixIcon}
              {label && (
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
              )}
            </MenuItemLabel>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {suffixIcon}
              {showMoreIcon && (
                <ChevronRightIcon sx={{ ml: theme.spacing(1) }} />
              )}
            </div>
          </>
        )}
      </>
    </MenuItem>
  ) : null;
};

export default MenuItemComponent;
