import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Typography } from '@mui/material';
import { Breakpoint, useTheme } from '@mui/material/styles';
import { ButtonPrimary } from '@transferto/shared/src/atoms/ButtonPrimary';
import { Dispatch, SetStateAction } from 'react';
import { useUserTracking } from '../../hooks/useUserTracking/useUserTracking';
import { MenuItem, MenuItemLabel } from './Navbar.style';

interface MenuItemProps {
  open: boolean;
  isOpenSubMenu: boolean;
  showButton: boolean;
  setOpenSubMenu: Dispatch<SetStateAction<string>>;
  showMoreIcon?: boolean;
  label: string;
  onClick: any;
  isScrollable?: boolean;
  triggerSubMenu: string;
  prefixIcon?: JSX.Element | string;
  suffixIcon?: JSX.Element | string;
  checkIcon?: boolean;
}

const MenuItemComponent = ({
  open,
  isOpenSubMenu,
  setOpenSubMenu,
  showButton,
  showMoreIcon = true,
  onClick,
  isScrollable,
  label,
  triggerSubMenu,
  prefixIcon,
  suffixIcon,
}: MenuItemProps) => {
  const theme = useTheme();
  const { trackEvent } = useUserTracking();

  return !!open && !isOpenSubMenu ? (
    <MenuItem
      disableRipple={showButton}
      showButton={showButton}
      isScrollable={isScrollable}
      onClick={() => {
        !!triggerSubMenu && setOpenSubMenu(triggerSubMenu);
        !!triggerSubMenu &&
          trackEvent({
            category: 'menu',
            action: 'open-submenu',
            label: triggerSubMenu,
            data: { subMenu: triggerSubMenu },
          });
        !!onClick && onClick();
      }}
    >
      <>
        {showButton ? (
          <ButtonPrimary fullWidth>
            <>
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
            </>
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
              <>
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
              </>
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
