import type { SxProps, Theme } from '@mui/material';
import type { MenuKeysEnum } from '@/const/menuKeys';
import type { MouseEventHandler, PropsWithChildren } from 'react';

export interface MenuItemLinkType {
  url: string;
  external?: boolean;
}

export interface MenuItemProps extends PropsWithChildren {
  open: boolean;
  isInteractive?: boolean;
  isDivider?: boolean;
  showButton?: boolean;
  disableRipple?: boolean;
  autoFocus?: boolean;
  showMoreIcon?: boolean;
  styles?: SxProps<Theme>;
  link?: MenuItemLinkType;
  label?: string;
  onClick?: MouseEventHandler<HTMLLIElement>;
  triggerSubMenu?: MenuKeysEnum;
  prefixIcon?: React.JSX.Element | string;
  suffixIcon?: React.JSX.Element | string;
}
