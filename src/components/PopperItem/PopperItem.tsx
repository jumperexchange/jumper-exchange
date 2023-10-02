import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Typography } from '@mui/material';
import type { Breakpoint } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { ButtonPrimary } from 'src/atoms';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
  type MenuKeys,
} from 'src/const';
import { useUserTracking } from 'src/hooks';
import { useMenuStore } from 'src/stores';
import { EventTrackingTool } from 'src/types';
import { PopperItemContainer as Container, PopperItemLabel } from '.';
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

export const PopperItem = ({
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
  const [onOpenPopperSubMenu] = useMenuStore((state) => [
    state.onOpenPopperSubMenu,
  ]);

  const handleClick = () => {
    triggerSubMenu && onOpenPopperSubMenu(triggerSubMenu);
    triggerSubMenu &&
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
    <Container
      disableRipple={showButton}
      showButton={showButton || false}
      autoFocus={autoFocus}
      onClick={handleClick}
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
            <PopperItemLabel
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
            </PopperItemLabel>
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
    </Container>
  ) : null;
};
