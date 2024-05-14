import { useMenuStore } from '@/stores/menu/MenuStore';
import type { PropsWithChildren } from 'react';
import { MenuClickAwayBox } from './Menu.style';
interface MenuClickAwayListenerProps {
  open: boolean;
}

export const MenuClickAwayListener: React.FC<
  PropsWithChildren<MenuClickAwayListenerProps>
> = ({ open, children }) => {
  const { closeAllMenus } = useMenuStore((state) => state);

  return (
    <MenuClickAwayBox
      open={open}
      className="click-away"
      onClick={(event) => {
        event.preventDefault();
        console.log('Click Away Listener', event.target);
        event.stopPropagation();
        // closeAllMenus();
      }}
    >
      {children}
    </MenuClickAwayBox>
  );
};
