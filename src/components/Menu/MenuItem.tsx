import { ButtonSecondary } from '@/components/Button/Button.style';
import type { MenuKeysEnum } from '@/const/menuKeys';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import { useMenuStore } from '@/stores/menu/MenuStore';
import { EventTrackingTool } from '@/types/userTracking';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type { SxProps, Theme } from '@mui/material';
import { useTheme } from '@mui/material';
import type { JsxElement } from 'typescript';
import {
  MenuItemButtonLabel,
  MenuItemContainer,
  MenuItemLabel,
  MenuLabel,
} from '.';

interface MenuItemProps {
  open: boolean;
  showButton: boolean | undefined;
  children?: Element | JsxElement | undefined;
  disableRipple?: boolean | undefined;
  autoFocus?: boolean;
  showMoreIcon?: boolean;
  styles?: SxProps<Theme>;
  label?: string;
  onClick?: () => void;
  triggerSubMenu?: MenuKeysEnum;
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
  const { setSubMenuState } = useMenuStore((state) => state);

  const handleClick = () => {
    triggerSubMenu && setSubMenuState(triggerSubMenu);
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
    onClick && onClick();
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
          <ButtonSecondary fullWidth>
            {prefixIcon}
            <MenuItemButtonLabel
              variant={'lifiBodyMediumStrong'}
              component={'span'}
            >
              {label}
            </MenuItemButtonLabel>
            {suffixIcon ?? null}
          </ButtonSecondary>
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
                <MenuItemLabel variant={'lifiBodyMedium'}>
                  {label}
                </MenuItemLabel>
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
