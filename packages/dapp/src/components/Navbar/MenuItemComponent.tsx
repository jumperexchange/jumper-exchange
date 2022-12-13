import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Dispatch, SetStateAction } from 'react';
import { MenuButton, MenuItem, MenuItemLabel } from './Navbar.styled';

interface MenuItemProps {
  open: boolean;
  openSubMenu: string;
  showButton: boolean;
  setOpenSubMenu: Dispatch<SetStateAction<string>>;
  label: string;
  extraIcon?: JSX.Element;
  onClick: any;
  stickyLabel?: boolean;
  triggerSubMenu: string;
  listIcon: JSX.Element | string;
  checkIcon?: boolean;
}

const MenuItemComponent = ({
  open,
  openSubMenu,
  setOpenSubMenu,
  showButton,
  extraIcon,
  onClick,
  stickyLabel,
  label,
  triggerSubMenu,
  listIcon,
}: MenuItemProps) => {
  const theme = useTheme();

  return !!open && openSubMenu === 'none' ? (
    <MenuItem
      disableRipple={showButton}
      showButton={showButton}
      stickyLabel={stickyLabel}
      onClick={() => {
        !!triggerSubMenu && setOpenSubMenu(triggerSubMenu);
        !!onClick && onClick();
      }}
    >
      <>
        {showButton ? (
          <MenuButton
            sx={{
              textTransform: 'none',
            }}
          >
            <>
              <Typography variant={'lifiBodyMediumStrong'} component={'span'}>
                <>{label}</>
              </Typography>
              {listIcon}
            </>
          </MenuButton>
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
              <ChevronRightIcon sx={{ ml: theme.spacing(2) }} />
            </div>
          </>
        )}
      </>
    </MenuItem>
  ) : null;
};

export default MenuItemComponent;
