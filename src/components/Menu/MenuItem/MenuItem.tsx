import { FC } from 'react';
import { MenuItemProps } from './MenuItem.types';
import { InteractiveMenuItem } from './InteractiveMenuItem';
import { NonInteractiveMenuItem } from './NonInteractiveMenuItem';
import { MenuDelimiter } from './MenuItem.style';

export const MenuItem: FC<MenuItemProps> = ({
  isInteractive = true,
  isDivider,
  ...rest
}) => {
  if (isDivider) {
    return <MenuDelimiter />;
  }

  if (isInteractive) {
    return <InteractiveMenuItem {...rest} />;
  }

  return <NonInteractiveMenuItem {...rest} />;
};
