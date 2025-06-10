import { FC } from 'react';
import { MenuItemProps } from './MenuItem.types';
import { InteractiveMenuItem } from './InteractiveMenuItem';
import { NonInteractiveMenuItem } from './NonInteractiveMenuItem';

export const MenuItem: FC<MenuItemProps> = ({
  isInteractive = true,
  ...rest
}) => {
  if (isInteractive) {
    return <InteractiveMenuItem {...rest} />;
  }

  return <NonInteractiveMenuItem {...rest} />;
};
