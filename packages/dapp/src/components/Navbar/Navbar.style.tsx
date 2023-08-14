import {
  AppBar,
  AppBarProps,
  ButtonProps,
  Link,
  LinkProps,
  ListItem,
  ListItemProps,
  MenuItem as MUIMenuItem,
  MenuItemProps as MUIMenuItemProps,
  MenuList,
  MenuListProps,
  Paper,
  PaperProps,
  Popper,
  PopperProps,
  Tab,
  TabProps,
  Tabs,
  TabsProps,
  Typography,
} from '@mui/material';

import { ButtonSecondary } from '@transferto/shared/src/atoms/index';

import { Breakpoint, alpha, styled } from '@mui/material/styles';
import { getContrastAlphaColor } from '@transferto/shared/src/utils';
import { ElementType } from 'react';

const MenuLabelHeight = '64px';

export enum NavbarHeight {
  XS = '64px',
  SM = '72px',
  LG = '80px',
}

export const NavbarBrandContainer = styled(Link)(({ theme }) => ({
  height: '48px',
  cursor: 'pointer',
  alignItems: 'center',
  display: 'flex',
}));

export const NavbarExternalBackground = styled('div')(({ theme }) => ({
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

export const NavbarManagement = styled('div')({
  display: 'flex',
  justifySelf: 'self-end',
});

export const NavBar = styled(AppBar)(({ theme }) => ({
  marginTop: theme.spacing(4),
  background: 'transparent',
  boxShadow: 'none',
}));

export const NavbarContainer = styled(AppBar)<{ sticky?: boolean }>(
  ({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    backdropFilter: 'blur(12px)',
    boxShadow: 'unset',
    background: 'transparent',
    alignItems: 'center',
    height: NavbarHeight.XS,
    padding: theme.spacing(2, 4),
    zIndex: 1500,
    [theme.breakpoints.up('sm' as Breakpoint)]: {
      height: NavbarHeight.SM,
      padding: theme.spacing(4, 6),
    },
    [theme.breakpoints.up('md' as Breakpoint)]: {
      padding: theme.spacing(6),
      height: NavbarHeight.LG,
    },
  }),
);

export const NavbarDropdownButton = styled(ButtonSecondary)<ButtonProps>(
  ({ theme }) => ({
    justifyContent: 'center',
    backgroundColor: 'transparent',
    color:
      theme.palette.mode === 'dark'
        ? theme.palette.accent1Alt.main
        : theme.palette.primary.main,
    width: '48px',
    borderRadius: '50%',
    marginLeft: theme.spacing(3),
    minWidth: 'unset',
    height: '48px',
    ':hover:before': {
      backgroundColor:
        theme.palette.mode === 'dark'
          ? getContrastAlphaColor(theme, '12%')
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
export interface NavbarMenuListProps extends Omit<MenuListProps, 'component'> {
  component?: string;
  isOpenSubMenu?: boolean;
  hasLabel?: boolean;
}

export const NavbarMenuList = styled(MenuList, {
  shouldForwardProp: (prop) => prop !== 'isOpenSubMenu' && prop !== 'hasLabel',
})<NavbarMenuListProps>(({ theme, isOpenSubMenu, hasLabel }) => ({
  marginTop: 0,
  padding: 0,
  '& > :first-of-type': {
    marginTop: isOpenSubMenu || hasLabel ? 'inherit' : theme.spacing(3),
    paddingTop: isOpenSubMenu ? theme.spacing(3) : 'inherit',
  },
  '& > :last-child': {
    marginBottom: isOpenSubMenu ? 'inherit' : theme.spacing(6),
    paddingBottom: isOpenSubMenu ? theme.spacing(3) : 'inherit',
    paddingTop: hasLabel ? 0 : 'inherit',
  },
}));

export const MenuHeader = styled('div')(() => ({
  padding: '0',
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  margin: '0 auto',
}));

export const MenuHeaderLabel = styled(Typography)(({ theme }) => ({
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

export const NavbarTabs = styled(Tabs, {
  shouldForwardProp: (prop) => prop !== 'isDarkMode',
})<TabsProps & { isDarkMode: boolean }>(({ theme }) => ({
  display: 'none',
  minWidth: 392,
  [theme.breakpoints.up('md' as Breakpoint)]: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor:
      theme.palette.mode === 'dark'
        ? theme.palette.alphaLight100.main
        : '#0000000A',
    margin: 'auto',
    borderRadius: 28,
    padding: 1,
    display: 'flex',
    alignItems: 'center',
  },
  div: {
    height: '56px',
  },
  '.MuiTabs-flexContainer': {
    alignItems: 'center',
  },
  '.MuiTabs-indicator': {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%) scaleY(0.98)',
    height: '48px',
    backgroundColor:
      theme.palette.mode === 'dark'
        ? theme.palette.alphaLight300.main
        : theme.palette.white.main,
    zIndex: '-1',
    borderRadius: '24px',
  },
  '> .MuiTabs-root': {
    minHeight: 'unset !important',
  },
  '.MuiTabs-root': {
    minHeight: 'unset !important',
  },
}));

export const NavbarTab = styled(Tab, {
  shouldForwardProp: (prop) => prop !== 'isDarkMode',
})<TabProps>(({ theme }) => ({
  textTransform: 'initial',
  borderRadius: 24,
  letterSpacing: 0,
  display: 'flex',
  flexGrow: 1,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontWeight: '700',
  fontSize: '16px',
  lineHeight: '20px',
  margin: '6px 4px',
  height: '48px',
  width: '142px',
  minHeight: 'unset',
  color:
    theme.palette.mode === 'dark'
      ? theme.palette.white.main
      : theme.palette.black.main,
  textDecoration: 'none',
  '&.Mui-selected': {
    color:
      theme.palette.mode === 'dark'
        ? theme.palette.white.main
        : theme.palette.black.main,
    backgroundColor: 'transparent',
  },

  ':hover': {
    backgroundColor: getContrastAlphaColor(theme, '4%'),
  },
}));

export const MenuHeaderText = styled('span')(({ theme }) => ({}));

export interface MenuItemProps extends Omit<MUIMenuItemProps, 'showButton'> {
  showButton?: boolean;
  component?: ElementType<any>;
}

export const MenuItem = styled(MUIMenuItem, {
  shouldForwardProp: (prop) => prop !== 'showButton' && prop !== 'component',
})<MenuItemProps>(({ theme, showButton }) => ({
  display: 'flex',
  padding: showButton ? theme.spacing(0, 3, 3) : theme.spacing(0, 3),
  backgroundColor: 'inherit',
  justifyContent: 'space-between',
  margin: theme.spacing(0, 3),
  marginTop: showButton ? theme.spacing(2) : 0,
  borderRadius: '12px',

  '&:hover': {
    backgroundColor: showButton
      ? 'transparent'
      : getContrastAlphaColor(theme, '4%'),
  },

  [theme.breakpoints.up('sm' as Breakpoint)]: {
    height: showButton ? 'auto' : '48px',
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

export interface MenuLinkItemProps extends Omit<LinkProps, 'component'> {
  component?: string;
}

export const MenuLinkItem = styled(Link, {
  shouldForwardProp: (prop) => prop !== 'component',
})<MenuLinkItemProps>(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: `0 ${theme.spacing(6)}`,
  height: '48px',
  textDecoration: 'none',
  color: 'inherit',
}));

export interface MenuItemLabelProps extends Omit<ListItemProps, 'variant'> {
  variant?: 'xs' | 'md' | 'lg';
}

export const MenuItemLabel = styled('div', {
  shouldForwardProp: (prop) => prop !== 'variant',
})<MenuItemLabelProps>(({ variant, theme }) => ({
  display: 'flex',
  alignItems: 'center',
  maxWidth: variant === 'xs' ? '198px' : variant === 'md' ? '232px' : '260px',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    maxWidth: variant === 'xs' ? '168px' : variant === 'md' ? '194px' : '244px',
  },
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
    // margin: theme.spacing(0),
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
    padding: theme.spacing(0, 3, 0, 3),
    color: theme.palette.text.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 48,

    [theme.breakpoints.up('sm' as Breakpoint)]: {
      padding: theme.spacing(0, 3),
      position: 'relative',
      justifyContent: 'flex-start',
    },
  }),
);
