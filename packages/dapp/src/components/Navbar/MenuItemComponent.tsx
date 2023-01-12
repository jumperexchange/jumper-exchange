import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Button } from '@transferto/shared/src/atoms/button';
import { Dispatch, SetStateAction } from 'react';
import { MenuItem, MenuItemLabel } from './Navbar.styled';

interface MenuItemProps {
  open: boolean;
  isOpenSubMenu: boolean;
  showButton: boolean;
  setOpenSubMenu: Dispatch<SetStateAction<string>>;
  showMoreIcon?: boolean;
  label: string;
  textColor?: string;
  bgColor?: string;
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
  textColor,
  bgColor,
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

  return !!open && isOpenSubMenu ? (
    <MenuItem
      disableRipple={showButton}
      showButton={showButton}
      isScrollable={isScrollable}
      onClick={() => {
        !!triggerSubMenu && setOpenSubMenu(triggerSubMenu);
        !!onClick && onClick();
      }}
    >
      <>
        {showButton ? (
          <Button
            textColor={textColor}
            bgColor={bgColor}
            sx={{
              textTransform: 'none',
            }}
          >
            <>
              {prefixIcon}
              <Typography
                variant={'lifiBodyMediumStrong'}
                component={'span'}
                ml={!!prefixIcon ? '9.5px' : 'inherit'}
                mr={!!prefixIcon ? '9.5px' : 'inherit'}
              >
                <>{label}</>
              </Typography>
              {suffixIcon}
            </>
          </Button>
        ) : (
          <>
            <MenuItemLabel>
              <>
                {prefixIcon}
                <Typography variant={'lifiBodyMedium'} ml={'12px'}>
                  <>{label}</>
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
