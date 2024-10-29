import { Typography } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Fade from '@mui/material/Fade';
import { useTranslation } from 'react-i18next';
import {
  MenuHeaderAppBar,
  MenuHeaderAppWrapper,
  MenuList,
  MenuPaper,
  MenuPopper,
} from 'src/components/Menu/Menu.style';
import { MenuItem } from 'src/components/Menu/MenuItem';
import { useAddressContent } from '../useAddressContent';

export const AddressMenu = ({
  open,
  setOpen,
  anchorEl,
}: {
  open: boolean;
  setOpen: any;
  anchorEl: HTMLElement | null;
}) => {
  const { t } = useTranslation();
  const addressBoxMenuItems = useAddressContent();

  return (
    <ClickAwayListener
      touchEvent={'onTouchStart'}
      mouseEvent={'onMouseDown'}
      onClickAway={(event) => {
        setTimeout(() => {
          event.stopPropagation();
          open && setOpen(false);
        }, 150);
      }}
    >
      <MenuPopper
        open={open}
        anchorEl={anchorEl}
        transition
        placement="bottom-end"
      >
        {({ TransitionProps }) => (
          <Fade
            {...TransitionProps}
            in={open}
            style={{
              transformOrigin: 'top',
            }}
          >
            <MenuPaper show={open} width={'320px'} className="menu-paper">
              <MenuList
                autoFocusItem={open}
                id="main-burger-menu"
                autoFocus={open}
                aria-labelledby="main-burger-menu"
                hasLabel={true}
                // component={isOpenSubMenu ? 'div' : 'ul'}
              >
                <MenuHeaderAppWrapper>
                  <MenuHeaderAppBar component="div" elevation={0}>
                    <Typography
                      variant={'bodyMediumStrong'}
                      width={'100%'}
                      align={'center'}
                      flex={1}
                      noWrap
                    >
                      {t('profile_page.addressMenu')}
                    </Typography>
                  </MenuHeaderAppBar>
                </MenuHeaderAppWrapper>
                {addressBoxMenuItems.map((el, index) => (
                  <MenuItem
                    key={`${el.label}-${index}`}
                    autoFocus={index > 0 ? true : false}
                    label={el.label}
                    prefixIcon={el.prefixIcon}
                    link={el.link}
                    showMoreIcon={el.showMoreIcon}
                    onClick={el.onClick}
                    open
                    showButton={false}
                  />
                ))}
              </MenuList>
            </MenuPaper>
          </Fade>
        )}
      </MenuPopper>
    </ClickAwayListener>
  );
};
