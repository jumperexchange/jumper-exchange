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
  extraIcon?: JSX.Element;
  textColor?: string;
  bgColor?: string;
  onClick: any;
  isScrollable?: boolean;
  triggerSubMenu: string;
  listIcon: JSX.Element | string;
  checkIcon?: boolean;
}

const MenuItemComponent = ({
  open,
  isOpenSubMenu,
  setOpenSubMenu,
  textColor,
  bgColor,
  showButton,
  extraIcon,
  showMoreIcon = true,
  onClick,
  isScrollable,
  label,
  triggerSubMenu,
  listIcon,
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
              {listIcon}
              <Typography
                variant={'lifiBodyMediumStrong'}
                component={'span'}
                ml={!!listIcon ? '9.5px' : 'inherit'}
              >
                <>{label}</>
              </Typography>
            </>
          </Button>
        ) : (
          <>
            <MenuItemLabel>
              <>
                {listIcon}
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
              {extraIcon}
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
