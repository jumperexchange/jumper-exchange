import type {
  ListItemProps,
  MenuItemProps as MUIMenuItemProps,
  TypographyProps,
} from '@mui/material';
import { alpha, MenuItem as MUIMenuItem, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { Breakpoint } from '@mui/material/styles';

/**
 * Base styled component for MenuItem that applies common styles and disables interaction.
 */
export const MenuItemBaseContainer = styled(MUIMenuItem)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'inherit',
  padding: theme.spacing(0, 1.5),
  backgroundColor: 'inherit',
  justifyContent: 'space-between',
  margin: theme.spacing(0, 1.5),
  height: 48,
  borderRadius: '12px',
  width: 'auto',
  pointerEvents: 'auto',
  placeContent: 'space-between',
  '&:hover, &:focus, &:active, &.Mui-selected': {
    backgroundColor: 'inherit',
  },
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    height: 48,
  },
}));

export interface MenuItemProps extends MUIMenuItemProps {
  showButton?: boolean;
}

export const MenuItemContainer = styled(MenuItemBaseContainer, {
  shouldForwardProp: (prop) => prop !== 'showButton',
})<MenuItemProps>(({ theme, showButton }) => ({
  pointerEvents: 'auto',
  '&:hover': {
    backgroundColor: alpha(theme.palette.white.main, 0.04),
    ...theme.applyStyles('light', {
      backgroundColor: alpha(theme.palette.black.main, 0.04),
    }),
  },
  ...(showButton && {
    padding: theme.spacing(0, 1.5, 1.5),
    height: 'auto',
    marginTop: theme.spacing(1),
    '&:hover': {
      backgroundColor: 'transparent',
    },
    [theme.breakpoints.up('sm' as Breakpoint)]: {
      height: 'auto',
    },
  }),
}));

export interface MenuLabelProps extends ListItemProps {
  variant?: 'xs' | 'md' | 'lg';
}

export const MenuLabel = styled('div')<MenuLabelProps>(({ theme, variant }) => {
  const baseMaxWidth = {
    xs: 198,
    md: 232,
    lg: 260,
  }[variant ?? 'lg'];

  const smMaxWidth = {
    xs: 168,
    md: 194,
    lg: 244,
  }[variant ?? 'lg'];

  return {
    display: 'flex',
    alignItems: 'center',
    maxWidth: baseMaxWidth,
    [theme.breakpoints.up('sm' as Breakpoint)]: {
      maxWidth: smMaxWidth,
    },
  };
});
export interface MenuItemLabelProps extends TypographyProps {
  prefixIcon?: React.JSX.Element | string;
}

export const MenuItemButtonLabel = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'prefixIcon',
})<MenuItemLabelProps>(({ theme, prefixIcon }) => ({
  marginLeft: prefixIcon ? '9.5px' : 'inherit',
  marginRight: prefixIcon ? '9.5px' : 'inherit',
  color: (theme.vars || theme).palette.white.main,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: 208,
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    maxWidth: 168,
  },
  ...theme.applyStyles('light', {
    color: (theme.vars || theme).palette.primary.main,
  }),
}));

export const MenuItemLabel = styled(Typography)<MenuItemLabelProps>(
  ({ theme, prefixIcon }) => ({
    marginLeft: theme.spacing(1.5),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    [theme.breakpoints.up('sm' as Breakpoint)]: {
      maxWidth: prefixIcon ? 188 : 'inherit',
    },
  }),
);

export const MenuDelimiter = styled('div')(({ theme }) => ({
  width: '100%',
  height: 1,
  backgroundColor: theme.palette.alphaLight200.main,
  ...theme.applyStyles('light', {
    backgroundColor: theme.palette.alphaDark200.main,
  }),
}));
