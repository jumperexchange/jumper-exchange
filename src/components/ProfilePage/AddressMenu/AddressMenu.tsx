import ClickAwayListener from '@mui/material/ClickAwayListener';
import Fade from '@mui/material/Fade';
import { MenuPaper, MenuPopper } from 'src/components/Menu/Menu.style';
import { MenuItem } from 'src/components/Menu/MenuItem';
import { useAddressMenuContent } from '../useAddressMenuContent';
import { AddressMenuList } from './AdressMenu.style';

export const AddressMenu = ({
  open,
  setOpen,
  anchorEl,
}: {
  open: boolean;
  setOpen: (value: boolean | ((prevState: boolean) => boolean)) => void;
  anchorEl: HTMLElement | null;
}) => {
  const addressBoxMenuItems = useAddressMenuContent();

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
            <MenuPaper
              show={open}
              className="menu-paper"
              sx={{ borderRadius: '12px', width: '320px' }}
            >
              <AddressMenuList
                autoFocusItem={open}
                id="address-menu"
                autoFocus={open}
                aria-labelledby="address-menu"
                hasLabel={true}
                sx={{
                  ':first-child': {
                    marginTop: '16px',
                  },
                  'li:last-of-type': {
                    marginBottom: '16px',
                  },
                }}
              >
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
              </AddressMenuList>
            </MenuPaper>
          </Fade>
        )}
      </MenuPopper>
    </ClickAwayListener>
  );
};
