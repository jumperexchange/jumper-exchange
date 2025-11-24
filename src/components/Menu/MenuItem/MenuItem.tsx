import type { FC } from 'react';
import type { MenuItemProps } from './MenuItem.types';
import { InteractiveMenuItem } from './InteractiveMenuItem';
import { NonInteractiveMenuItem } from './NonInteractiveMenuItem';
import { MenuDelimiter } from './MenuItem.style';

export const MenuItem: FC<MenuItemProps> = ({
  isInteractive = true,
  isDivider,
  ...rest
}) => {
  if (isDivider) {
    return <MenuDelimiter sx={rest.styles} />;
  }

  if (isInteractive) {
    return <InteractiveMenuItem {...rest} />;
  }

  return <NonInteractiveMenuItem {...rest} />;
};
