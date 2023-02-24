import {
  AppBar,
  AppBarProps,
  Box,
  ButtonProps,
  IconButton,
  Link,
  LinkProps,
  ListItem,
  ListItemProps,
  MenuItem as MUIMenuItem,
  MenuItemProps,
  MenuList,
  MenuListProps,
  Paper,
  PaperProps,
  Popper,
  PopperProps,
  Tab,
  TabProps,
  Tabs,
  TabsProps
} from '@mui/material';

import { ButtonSecondary } from '@transferto/shared/src/atoms/ButtonSecondary';

import { styled } from '@mui/material/styles';
import { getContrastAlphaColor } from '@transferto/shared/src/utils';

export const NavbarBrandContainer = styled(Link)(({ theme }) => ({
  height: '48px',
  alignItems: 'center',
  display: 'flex',
}));

export const NavbarExternalBackground = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1,
  backgroundColor: '#000000',
  opacity: theme.palette.mode === 'dark' ? 0.75 : 0.25,
  [theme.breakpoints.up('sm')]: {
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

export const HeaderAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  flexDirection: 'row',
  alignItems: 'center',
  position: 'relative',
  minHeight: 40,
  padding: theme.spacing(0, 3, 0, 3),
  ':first-of-type': {
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(0.5),
  },
}));

export const Container = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'sticky',
})<{ sticky?: boolean }>(({ theme, sticky }) => ({
  backgroundColor: theme.palette.background.default,
  position: sticky ? 'sticky' : 'relative',
  display: 'flex',
  justifyContent: 'space-between',
  top: 0,
  zIndex: 1400,
}));

export const NavbarContainer = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'sticky',
})<{ sticky?: boolean }>(({ theme, sticky }) => ({
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  position: sticky ? 'sticky' : 'relative',
  top: 0,
  boxShadow: 'unset',
  background: 'transparent',
  alignItems: 'center',
  height: '64px',
  padding: theme.spacing(2, 4),
  zIndex: 1300,
  [theme.breakpoints.up('sm')]: {
    height: '72px',
    padding: theme.spacing(4, 6),
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(6),
    height: '80px',
  },
  [`@media (max-height: ${80 + 18 + 680}px)`]: {
    paddingRight: theme.spacing(2),
    width: 'calc( 100% - 16px )',
    backdropFilter: 'blur(12px)',
  },
}));

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

export interface NavbarPopperProps extends Omit<PopperProps, 'isScrollable'> {}

export const NavbarPopper = styled(Popper, {
  shouldForwardProp: (prop) => prop !== 'isScrollable',
})<NavbarPopperProps>(({ theme }) => ({
  zIndex: 1300,
  bottom: '0 !important',
  left: '0 !important',
  top: 'unset !important',
  right: '0 !important',
  [theme.breakpoints.up('sm')]: {
    bottom: 'unset !important',
    left: 'unset !important',
    top: 'unset !important',
    right: '1.5rem !important',
    transform: 'unset !important',
  },
}));
export interface NavbarMenuListProps
  extends Omit<MenuListProps, 'isScrollable'> {
  component?: string;
}

export const NavbarMenuList = styled(MenuList)<NavbarMenuListProps>(() => ({
  padding: 0,
}));

export const NavbarLinkText = styled('span')({});

export const MenuHeader = styled('div')(() => ({
  padding: '0',
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  margin: '0 auto',
  '& svg': {
    position: 'absolute',
  },
}));

export const BackArrowButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary,
  position: 'absolute',
  '&:hover': {
    backgroundColor: getContrastAlphaColor(theme, '4%'),
  },
}));

export const NavbarTabs = styled(Tabs, {
  shouldForwardProp: (prop) => prop !== 'isDarkMode',
})<TabsProps & { isDarkMode: boolean }>(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.up('md')]: {
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
    width: 390,
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

export interface MUIMenuItemProps extends Omit<MenuItemProps, 'showButton'> {
  showButton?: boolean;
  component?: string;
  isScrollable?: boolean;
}

export const MenuItem = styled(MUIMenuItem, {
  shouldForwardProp: (prop) => prop !== 'showButton' && prop !== 'isScrollable',
})<MUIMenuItemProps>(({ theme, showButton }) => ({
  display: 'flex',
  padding: showButton ? theme.spacing(0, 3, 3) : theme.spacing(0, 3),
  backgroundColor: 'inherit',
  justifyContent: 'space-between',
  marginTop: showButton && theme.spacing(2),
  borderRadius: '12px',

  '&:hover': {
    backgroundColor: showButton
      ? 'transparent'
      : getContrastAlphaColor(theme, '4%'),
  },

  '> .menu-item-label__icon': {
    marginLeft: '13px',
  },
  [theme.breakpoints.up('sm')]: {
    height: showButton ? 'auto' : '48px',
  },
}));

export interface NavbarPaperProps extends Omit<PaperProps, 'isDarkMode'> {
  isDarkMode?: boolean;
  isOpenSubMenu?: boolean;
  openSubMenu?: string;
  isSubMenu?: boolean;
  component?: string;
  isScrollable?: boolean;
}

export const NavbarPaper = styled(Paper, {
  shouldForwardProp: (prop) =>
    prop !== 'isDarkMode' &&
    prop !== 'isOpenSubMenu' &&
    prop !== 'openSubMenu' &&
    prop !== 'isSubMenu' &&
    prop !== 'isScrollable',
})<NavbarPaperProps>(
  ({ theme, isDarkMode, isOpenSubMenu, isScrollable, openSubMenu }) => ({
    background: theme.palette.surface1.main,
    padding: 0,
    marginTop: 0,
    boxShadow: !isDarkMode
      ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)'
      : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
    borderRadius: '12px 12px 0 0',
    marginBottom: 0,
    maxHeight: 'calc( 100vh - 64px - 12px )', // viewHeight - navbarHeight - offset
    overflowY: !!isScrollable ? 'auto' : 'inherit',
    overflowX: 'hidden',

    '> .navbar-menu-list': {
      marginTop: 0,
      padding: !!isOpenSubMenu
        ? openSubMenu === 'wallets'
          ? `${theme.spacing(0, 3, 3)} !important`
          : `${theme.spacing(0)} !important`
        : `${theme.spacing(3)} !important`,
    },
    '> .navbar-menu-list.open > ul': {
      padding: `${theme.spacing(0, 3, 3)} !important`,
    },
    width: '100%',
    transformOrigin: 'bottom',
    transition:
      'opacity 307ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 204ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',

    [theme.breakpoints.up('sm')]: {
      transformOrigin: 'inherit',
      maxHeight: 'calc( 100vh - 72px - 12px )',

      borderRadius: '12px !important',
      width: '288px',
      marginTop: '-2px',
    },

    [theme.breakpoints.up('md')]: {
      maxHeight: 'calc( 100vh - 80px - 12px )',
    },
  }),
);

export interface MenuLinkItemProps extends Omit<LinkProps, 'component'> {
  component?: string;
}

export const MenuLinkItem = styled(Link, {
  shouldForwardProp: (prop) => prop !== 'component' && prop !== 'isScrollable',
})<MenuLinkItemProps>(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: `0 ${theme.spacing(6)}`,
  height: '48px',
  textDecoration: 'none',
  color: 'inherit',
  '> .menu-item-label__icon': {
    marginLeft: '13px',
  },
}));

export const MenuItemLabel = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

export const MenuItemText = styled('span')({});

export interface MenuHeaderAppWrapperProps
  extends Omit<ListItemProps, 'isScrollable'> {
  component?: string;
  isScrollable?: boolean;
}

export const MenuHeaderAppWrapper = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== 'isScrollable',
})<MenuHeaderAppWrapperProps>({
  position: 'sticky',
  top: 0,
  alignItems: 'center',
  backgroundColor: 'transparent',
  backdropFilter: 'blur(12px)',
  zIndex: 1,
  overflow: 'hidden',
  margin: '0 -12px',
  padding: '0 12px',
  marginTop: 'inherit',
  height: '64px',
});

export interface MenuHeaderAppBarProps extends Omit<AppBarProps, 'component'> {
  component?: string;
  isScrollable?: boolean;
}

export const MenuHeaderAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'isScrollable',
})<MenuHeaderAppBarProps>(({ theme }) => ({
  backgroundColor: 'transparent !important',
  zIndex: 1,
  position: 'fixed',
  top: 'initial',
  left: 'initial',
  right: 'initial',
  padding: theme.spacing(0, 3, 0, 3),
  color: theme.palette.text.primary,
  flexDirection: 'row',
  alignItems: 'center',
  minHeight: 48,
}));
