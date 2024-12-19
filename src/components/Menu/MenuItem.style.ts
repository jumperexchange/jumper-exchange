import type {
  ListItemProps,
  MenuItemProps as MUIMenuItemProps,
  TypographyProps,
} from '@mui/material';
import { MenuItem as MUIMenuItem, Typography } from '@mui/material';

import { getContrastAlphaColor } from '@/utils/colors';
import type { Breakpoint } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

export interface MenuItemProps extends MUIMenuItemProps {
  showButton?: boolean;
}

export const MenuItemContainer = styled(MUIMenuItem, {
  shouldForwardProp: (prop) => prop !== 'showButton',
})<MenuItemProps>(({ theme, showButton }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'inherit',
  padding: showButton ? theme.spacing(0, 1.5, 1.5) : theme.spacing(0, 1.5),
  backgroundColor: 'inherit',
  justifyContent: 'space-between',
  margin: theme.spacing(0, 1.5),
  height: showButton ? 'auto' : 48,
  marginTop: showButton ? theme.spacing(1) : 0,
  borderRadius: '12px',
  width: 'auto',
  placeContent: 'space-between',

  '&:hover': {
    backgroundColor: showButton
      ? 'transparent'
      : getContrastAlphaColor(theme, '4%'),
  },

  [theme.breakpoints.up('sm' as Breakpoint)]: {
    height: showButton ? 'auto' : 48,
  },
}));

export interface MenuLabelProps extends ListItemProps {
  variant?: 'xs' | 'md' | 'lg';
}

export const MenuLabel = styled('div', {
  shouldForwardProp: (prop) => prop !== 'variant',
})<MenuLabelProps>(({ variant, theme }) => ({
  display: 'flex',
  alignItems: 'center',
  maxWidth: variant === 'xs' ? 198 : variant === 'md' ? 232 : 260,
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    maxWidth: variant === 'xs' ? 168 : variant === 'md' ? 194 : 244,
  },
}));

export interface MenuItemLabelProps extends TypographyProps {
  prefixIcon?: JSX.Element | string;
}

export const MenuItemButtonLabel = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'prefixIcon',
})<MenuItemLabelProps>(({ prefixIcon, theme }) => ({
  marginLeft: !!prefixIcon ? '9.5px' : 'inherit',
  marginRight: !!prefixIcon ? '9.5px' : 'inherit',
  color:
    theme.palette.mode === 'light'
      ? theme.palette.primary.main
      : theme.palette.white.main,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: 208,
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    maxWidth: 168,
  },
}));

export const MenuItemLabel = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'prefixIcon',
})<MenuItemLabelProps>(({ prefixIcon, theme }) => ({
  marginLeft: theme.spacing(1.5),
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    maxWidth: prefixIcon ? 188 : 'inherit',
  },
}));
