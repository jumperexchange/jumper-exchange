import type {
  AppBarProps,
  ButtonProps,
  LinkProps,
  ListItemProps,
  MenuListProps,
  PaperProps,
  PopperProps,
} from '@mui/material';
import {
  AppBar,
  Link,
  ListItem,
  MenuList,
  Paper,
  Popper,
  Typography,
} from '@mui/material';

import type { Breakpoint } from '@mui/material/styles';
import { alpha, styled } from '@mui/material/styles';
import type { ElementType } from 'react';
import { ButtonSecondary } from 'src/atoms';
import { getContrastAlphaColor } from 'src/utils';

const MenuLabelHeight = '64px';

export const PopperExternalBackground = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1400,
  backgroundColor: '#000000',
  opacity: theme.palette.mode === 'dark' ? 0.75 : 0.25,
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    backgroundColor: 'transparent',
  },
}));

export const PopperToggle = styled(ButtonSecondary)<ButtonProps>(
  ({ theme }) => ({
    justifyContent: 'center',
    backgroundColor: 'transparent',
    color:
      theme.palette.mode === 'dark'
        ? theme.palette.accent1Alt.main
        : theme.palette.primary.main,
    width: '48px',
    borderRadius: '50%',
    marginLeft: theme.spacing(1.5),
    minWidth: 'unset',
    height: '48px',
    ':hover:before': {
      backgroundColor:
        theme.palette.mode === 'dark'
          ? getContrastAlphaColor(theme, '4%')
          : theme.palette.alphaDark100.main,
    },
    ':hover': {
      backgroundColor: 'transparent',
    },
  }),
);

export const NavbarPopper = styled(Popper)<PopperProps>(({ theme }) => ({
  zIndex: 1600,
  bottom: '0 !important',
  left: '0 !important',
  top: 'unset !important',
  right: '0 !important',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    bottom: 'unset !important',
    left: 'unset !important',
    top: 'unset !important',
    right: '1.5rem !important',
    transform: 'unset !important',
  },
}));
export interface PopperMenuListProps extends Omit<MenuListProps, 'component'> {
  component?: string;
  isOpenSubMenu?: boolean;
  hasLabel?: boolean;
}

export const PopperMenuList = styled(MenuList, {
  shouldForwardProp: (prop) => prop !== 'isOpenSubMenu' && prop !== 'hasLabel',
})<PopperMenuListProps>(({ theme, isOpenSubMenu, hasLabel }) => ({
  marginTop: 0,
  padding: 0,
  '& > :first-of-type': {
    marginTop: isOpenSubMenu || hasLabel ? 'inherit' : theme.spacing(1.5),
    paddingTop: isOpenSubMenu ? theme.spacing(1.5) : 'inherit',
  },
  '& > :last-child': {
    marginBottom: isOpenSubMenu ? 'inherit' : theme.spacing(3),
    paddingBottom: isOpenSubMenu ? theme.spacing(1.5) : 'inherit',
    paddingTop: hasLabel ? 0 : 'inherit',
  },
}));

export const PopperHeaderLabel = styled(Typography)(({ theme }) => ({
  ...theme.typography.lifiBodyMediumStrong,
  width: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  justifyContent: 'center',
  display: 'flex',
  marginRight: '38px',
  flexWrap: 'nowrap',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    maxWidth: '174px',
    marginRight: '0px',
    marginLeft: '6px',
  },
}));

export interface NavbarPaperProps
  extends Omit<PaperProps, 'isDarkMode' | 'isWide' | 'component'> {
  isDarkMode?: boolean;
  isWide?: boolean;
  component?: ElementType<any>;
}

export const NavbarPaper = styled(Paper, {
  shouldForwardProp: (prop) =>
    prop !== 'isDarkMode' && prop !== 'isWide' && prop !== 'isSubMenu',
})<NavbarPaperProps>(({ theme, isDarkMode, isWide }) => ({
  background: theme.palette.surface1.main,
  padding: 0,
  marginTop: 0,
  boxShadow: !isDarkMode
    ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)'
    : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
  borderRadius: '12px 12px 0 0',
  marginBottom: 0,
  maxHeight: `calc( 100vh - ${MenuLabelHeight} - 12px )`, // viewHeight - navbarHeight - offset
  overflowY: 'auto',
  overflowX: 'hidden',
  width: '100%',
  transformOrigin: 'bottom',
  transition:
    'opacity 307ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 204ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',

  [theme.breakpoints.up('sm' as Breakpoint)]: {
    transformOrigin: 'inherit',
    maxHeight: 'calc( 100vh - 72px - 12px )',
    borderRadius: '12px !important',
    width: isWide ? '320px' : '288px',
    marginTop: '-2px',
  },

  [theme.breakpoints.up('md' as Breakpoint)]: {
    maxHeight: 'calc( 100vh - 80px - 12px )',
  },
}));

export interface PopperLinkItemProps extends Omit<LinkProps, 'component'> {
  component?: string;
}

export const PopperLinkItem = styled(Link, {
  shouldForwardProp: (prop) => prop !== 'component',
})<PopperLinkItemProps>(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: `0 ${theme.spacing(1.5)}`,
  height: '48px',
  textDecoration: 'none',
  color: 'inherit',
}));

export const MenuItemText = styled('span')({});

export const MenuHeaderAppWrapper = styled(ListItem)<ListItemProps>(
  ({ theme }) => ({
    position: 'sticky',
    top: 0,
    alignItems: 'center',
    backgroundColor: alpha(theme.palette.surface1.main, 0.84),
    backdropFilter: 'blur(12px)',
    zIndex: 1400,
    overflow: 'hidden',
    margin: theme.spacing(0),
    marginTop: '0px',
    height: MenuLabelHeight,
    padding: '0px',
    borderTopLeftRadius: '24px',
    borderTopRightRadius: '24px',
    [theme.breakpoints.up('sm' as Breakpoint)]: {
      paddingLeft: '0px',
    },
  }),
);
export interface MenuHeaderAppBarProps extends Omit<AppBarProps, 'component'> {
  component?: string;
}

export const MenuHeaderAppBar = styled(AppBar)<MenuHeaderAppBarProps>(
  ({ theme }) => ({
    backgroundColor: 'transparent',
    zIndex: 1500,
    position: 'fixed',
    top: 'initial',
    left: 'initial',
    right: 'initial',
    padding: theme.spacing(0, 1.5, 0, 1.5),
    color: theme.palette.text.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 48,

    [theme.breakpoints.up('sm' as Breakpoint)]: {
      padding: theme.spacing(0, 1.5),
      position: 'relative',
      justifyContent: 'flex-start',
    },
  }),
);
