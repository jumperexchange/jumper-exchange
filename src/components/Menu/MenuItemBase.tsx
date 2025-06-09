import { MenuItemBaseContainer } from './MenuItem.style';

interface MenuItemBaseProps extends React.PropsWithChildren {}

export const MenuItemBase = ({ children }: MenuItemBaseProps) => {
  return (
    <MenuItemBaseContainer disableRipple sx={{ cursor: 'auto' }}>
      {children}
    </MenuItemBaseContainer>
  );
};
