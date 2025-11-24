import type { SxProps, Theme } from '@mui/material';
import { MenuItemBaseContainer } from './MenuItem.style';
import type { MenuItemProps } from './MenuItem.types';

export const NonInteractiveMenuItem = ({
  children,
  styles,
}: Pick<MenuItemProps, 'children' | 'styles'>) => {
  const combinedStyles: SxProps<Theme> = styles
    ? ([styles, { cursor: 'auto' }] as SxProps<Theme>)
    : { cursor: 'auto' };

  return (
    <MenuItemBaseContainer
      disableRipple
      role="presentation"
      sx={combinedStyles}
    >
      {children}
    </MenuItemBaseContainer>
  );
};
