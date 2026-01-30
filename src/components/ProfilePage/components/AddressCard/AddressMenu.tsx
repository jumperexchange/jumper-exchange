import ClickAwayListener from '@mui/material/ClickAwayListener';
import Fade from '@mui/material/Fade';
import { MenuPaper, MenuPopper } from 'src/components/Menu/Menu.style';
import { MenuItem } from 'src/components/Menu/MenuItem/MenuItem';
import { useAddressMenuContent } from '../../useAddressMenuContent';
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
        placement="bottom"
        sx={(theme) => ({ top: `${theme.spacing(1)} !important` })}
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
              sx={(theme) => ({
                height: 'fit-content',
                borderRadius: `${theme.shape.radius12}px`,
                width: theme.spacing(40),
              })}
            >
              <AddressMenuList
                autoFocusItem={open}
                id="address-menu"
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus={open}
                aria-labelledby="address-menu"
                hasLabel={true}
              >
                {addressBoxMenuItems.map((el, index) => (
                  <MenuItem
                    key={`${el.label}-${index}`}
                    // eslint-disable-next-line jsx-a11y/no-autofocus
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
