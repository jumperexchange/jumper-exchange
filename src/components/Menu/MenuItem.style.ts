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
})<MenuItemProps>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'inherit',
  padding: theme.spacing(0, 1.5),
  backgroundColor: 'inherit',
  justifyContent: 'space-between',
  margin: theme.spacing(0, 1.5),
  height: 48,
  marginTop: 0,
  borderRadius: '12px',
  width: 'auto',
  placeContent: 'space-between',
  '&:hover': {
    backgroundColor: getContrastAlphaColor(theme, '4%'),
  },
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    height: 48,
  },
  variants: [
    {
      props: ({ showButton }) => showButton,
      style: {
        padding: theme.spacing(0, 1.5, 1.5),
      },
    },
    {
      props: ({ showButton }) => showButton,
      style: {
        height: 'auto',
      },
    },
    {
      props: ({ showButton }) => showButton,
      style: {
        marginTop: theme.spacing(1),
      },
    },
    {
      props: ({ showButton }) => showButton,
      style: {
        '&:hover': {
          backgroundColor: 'transparent',
        },
      },
    },
    {
      props: ({ showButton }) => showButton,
      style: {
        [theme.breakpoints.up('sm' as Breakpoint)]: {
          height: 'auto',
        },
      },
    },
  ],
}));

export interface MenuLabelProps extends ListItemProps {
  variant?: 'xs' | 'md' | 'lg';
}

export const MenuLabel = styled('div', {
  shouldForwardProp: (prop) => prop !== 'variant',
})<MenuLabelProps>(({ variant, theme }) => ({
  display: 'flex',
  alignItems: 'center',
  maxWidth: variant === 'md' ? 232 : 260,
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    maxWidth: variant === 'md' ? 194 : 244,
  },
  variants: [
    {
      props: {
        variant: 'xs',
      },
      style: {
        maxWidth: 198,
      },
    },
    {
      props: {
        variant: 'xs',
      },
      style: {
        [theme.breakpoints.up('sm' as Breakpoint)]: {
          maxWidth: 168,
        },
      },
    },
  ],
}));

export interface MenuItemLabelProps extends TypographyProps {
  prefixIcon?: JSX.Element | string;
}

export const MenuItemButtonLabel = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'prefixIcon',
})<MenuItemLabelProps>(({ theme }) => ({
  marginLeft: 'inherit',
  marginRight: 'inherit',
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
  variants: [
    {
      props: ({ prefixIcon }) => !!prefixIcon,
      style: {
        marginLeft: '9.5px',
      },
    },
    {
      props: ({ prefixIcon }) => !!prefixIcon,
      style: {
        marginRight: '9.5px',
      },
    },
  ],
}));

export const MenuItemLabel = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'prefixIcon',
})<MenuItemLabelProps>(({ theme }) => ({
  marginLeft: theme.spacing(1.5),
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    maxWidth: 'inherit',
  },
  variants: [
    {
      props: ({ prefixIcon }) => prefixIcon,
      style: {
        [theme.breakpoints.up('sm' as Breakpoint)]: {
          maxWidth: 188,
        },
      },
    },
  ],
}));
