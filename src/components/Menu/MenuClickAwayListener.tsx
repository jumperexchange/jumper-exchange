import { useMenuStore } from '@/stores/menu/MenuStore';
import type { CSSObject } from '@mui/material';
import type { PropsWithChildren } from 'react';
import { MenuClickAwayBox } from './Menu.style';
interface MenuClickAwayListenerProps {
  open: boolean;
  styles?: CSSObject;
}

export const MenuClickAwayListener: React.FC<
  PropsWithChildren<MenuClickAwayListenerProps>
> = ({ open, children, styles }) => {
  const { closeAllMenus } = useMenuStore((state) => state);

  return open ? (
    <MenuClickAwayBox
      open={open}
      className="click-away"
      sx={styles}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        closeAllMenus();
      }}
    >
      {children}
    </MenuClickAwayBox>
  ) : (
    children
  );
};
