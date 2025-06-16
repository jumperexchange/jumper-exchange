import { MenuItemBaseContainer } from './MenuItem.style';
import type { MenuItemProps } from './MenuItem.types';

export const NonInteractiveMenuItem = ({
  children,
}: Pick<MenuItemProps, 'children'>) => {
  return (
    <MenuItemBaseContainer
      disableRipple
      role="presentation"
      sx={{ cursor: 'auto' }}
    >
      {children}
    </MenuItemBaseContainer>
  );
};
