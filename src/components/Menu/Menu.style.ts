'use client';
import type {
  AppBarProps,
  ListItemProps,
  MenuListProps as MuiMenuListProps,
  PaperProps,
  PopperProps,
} from '@mui/material';
import {
  AppBar,
  Drawer,
  Link,
  ListItem,
  MenuList as MuiMenuList,
  Paper,
  Popper,
  Typography,
} from '@mui/material';

import type { Breakpoint } from '@mui/material/styles';
import { alpha, styled } from '@mui/material/styles';

const MENU_LABEL_HEIGHT = 64;

export const MenuPopper = styled(Popper)<PopperProps>(({ theme }) => ({
  zIndex: 1600,
  top: '16px !important',
  position: 'fixed',
}));

export interface MenuListProps extends Omit<MuiMenuListProps, 'component'> {
  component?: string;
  isOpenSubMenu?: boolean;
  cardsLayout?: boolean;
  hasLabel?: boolean;
}

export const MenuList = styled(MuiMenuList, {
  shouldForwardProp: (prop) =>
    prop !== 'isOpenSubMenu' && prop !== 'hasLabel' && prop !== 'cardsLayout',
})<MenuListProps>(({ theme, isOpenSubMenu, hasLabel, cardsLayout }) => ({
  marginTop: 0,
  display: 'block',
  flexDirection: 'unset',
  justifyContent: 'unset',
  flexWrap: 'inherit',
  padding: 0,
  outline: 'unset',
  gap: 'inherit',
  '& > :first-of-type': {
    marginTop:
      isOpenSubMenu || hasLabel || cardsLayout ? 'inherit' : theme.spacing(1.5),
  },
  '& > li:last-of-type': {
    marginBottom: theme.spacing(3),
    paddingBottom: 'inherit',
    paddingTop: 'inherit',
  },
  variants: [
    {
      props: ({ cardsLayout }) => cardsLayout,
      style: {
        display: 'flex',
      },
    },
    {
      props: ({ cardsLayout }) => cardsLayout,
      style: {
        flexDirection: 'column',
      },
    },
    {
      props: ({ cardsLayout }) => cardsLayout,
      style: {
        justifyContent: 'center',
      },
    },
    {
      props: ({ cardsLayout }) => cardsLayout,
      style: {
        flexWrap: 'wrap',
      },
    },
    {
      props: ({ cardsLayout }) => cardsLayout,
      style: {
        padding: theme.spacing(0, 3),
      },
    },
    {
      props: ({ cardsLayout }) => cardsLayout,
      style: {
        gap: '12px',
      },
    },
    {
      props: ({ isOpenSubMenu }) => isOpenSubMenu,
      style: {
        '& > li:last-of-type': {
          marginBottom: 'inherit',
        },
      },
    },
    {
      props: ({ isOpenSubMenu }) => isOpenSubMenu,
      style: {
        '& > li:last-of-type': {
          paddingBottom: theme.spacing(1.5),
        },
      },
    },
    {
      props: ({ hasLabel }) => hasLabel,
      style: {
        '& > li:last-of-type': {
          paddingTop: 0,
        },
      },
    },
  ],
}));

export const MenuHeaderLabel = styled(Typography)(({ theme }) => ({
  ...theme.typography.bodyMediumStrong,
  width: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  justifyContent: 'center',
  display: 'flex',
  marginRight: theme.spacing(4.75),
  flexWrap: 'nowrap',
  [theme.breakpoints.up('md' as Breakpoint)]: {
    maxWidth: 174,
    marginRight: 0,
    marginLeft: theme.spacing(0.75),
  },
}));

export interface MenuPaperProps extends PaperProps {
  isMobile?: boolean;
  show: boolean;
  width?: string;
}

export const MenuPaper = styled(Paper, {
  shouldForwardProp: (prop) =>
    prop !== 'isMobile' && prop !== 'width' && prop !== 'show',
})<MenuPaperProps>(({ theme, isMobile, show, width }) => ({
  display: !show ? 'none' : 'block',
  background: theme.palette.surface1.main,
  padding: 0,
  marginTop: 0,
  boxShadow:
    theme.palette.mode === 'light'
      ? `0px ${isMobile ? '-' : ''}2px 4px rgba(0, 0, 0, 0.08), 0px ${
          isMobile ? '-' : ''
        }8px 16px rgba(0, 0, 0, 0.16)`
      : `0px ${isMobile ? '-' : ''}2px 4px rgba(0, 0, 0, 0.08), 0px ${
          isMobile ? '-' : ''
        }8px 16px rgba(0, 0, 0, 0.08)`,
  borderRadius: '12px 12px 0 0',
  marginBottom: 0,
  // viewHeight - navbarHeight - offset
  maxHeight: `calc( 100vh - ${MENU_LABEL_HEIGHT}px - 12px )`,
  overflowY: 'auto',
  overflowX: 'hidden',
  width: '100%',
  transformOrigin: 'bottom',
  height: '100% !important',
  transition:
    'opacity 307ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 204ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  '.submenu .wallet-select-avatar': {
    width: 32,
    height: 32,
  },
  '.submenu': { paddingBottom: theme.spacing(1.5) },
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    maxHeight: 'calc( 100vh - 72px - 12px )',
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    transformOrigin: 'inherit',
    maxHeight: 'calc( 100vh - 80px - 12px )',
    borderRadius: '12px !important',
    width: width ?? 288,
    marginTop: -2,
  },
  variants: [
    {
      props: ({ show }) => !show,
      style: {
        display: 'none',
      },
    },
  ],
}));

export const MobileDrawer = styled(Drawer)(() => ({
  zIndex: 1400,
}));

export const MenuItemLink = styled(Link)(() => ({
  display: 'flex',
  alignItems: 'center',
  height: 48,
  width: '100%',
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
    marginBottom: 'inherit',
    marginTop: 0,
    height: MENU_LABEL_HEIGHT,
    padding: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    [theme.breakpoints.up('sm' as Breakpoint)]: {
      paddingLeft: 0,
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
