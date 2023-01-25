import {
  AppBar,
  AppBarProps,
  Button,
  ButtonProps,
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
  TabsProps,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { getContrastAlphaColor } from '@transferto/shared/src/utils';

export const MenuBrand = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  margin: `auto ${theme.spacing(4)} auto ${theme.spacing(2)}`,
  textDecoration: 'none',
  position: 'absolute',
  '&:hover': {
    color: theme.palette.accent1.main,
  },
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
  justifySelf: 'self-end',
});

export const NavBar = styled(AppBar)(({ theme }) => ({
  marginTop: theme.spacing(4),
  background: 'transparent',
  boxShadow: 'none',
}));

export const NavbarContainer = styled('div')(({ theme }) => ({
  position: 'initial',
  background: 'transparent',
  height: '72px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(4, 6),
  [theme.breakpoints.down('sm')]: {
    height: '64px',
    padding: theme.spacing(2, 4),
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(6),
    height: '80px',
  },
}));

export interface NavbarDropDownButtonProps
  extends Omit<ButtonProps, 'mainCol'> {}

export const NavbarDropdownButton = styled(
  Button,
  {},
)<NavbarDropDownButtonProps>(({ theme }) => ({
  justifyContent: 'center',
  color:
    theme.palette.mode === 'dark'
      ? theme.palette.accent1Alt.main
      : theme.palette.primary.main,
  width: '48px',
  borderRadius: '50%',
  marginLeft: theme.spacing(3),
  minWidth: 'unset',
  height: '48px',
}));

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
  component?: string; //TODO: valid typescript HTML elements as string
}

export const NavbarMenuList = styled(MenuList)<NavbarMenuListProps>(({}) => ({
  padding: 0,
}));

export const NavbarLinkText = styled('span')({});

export const MenuHeader = styled('div')(({}) => ({
  padding: '0',
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  margin: '0 auto',
  '& svg': {
    position: 'absolute',
  },
}));

export const NavbarTabs = styled(Tabs, {
  shouldForwardProp: (prop) => prop !== 'isDarkMode',
})<TabsProps & { isDarkMode: boolean }>(({ theme }) => ({
  // visibility: 'hidden',
  display: 'none',
  [theme.breakpoints.up('lg')]: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor:
      theme.palette.mode === 'dark'
        ? theme.palette.alphaLight100.main
        : '#0000000A',
    margin: 'auto',
    // height: 56,
    borderRadius: 28,
    padding: 1,
    display: 'flex',
    // visibility: 'visible',
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
    transform: 'translateY(-50%)',
    height: '48px',
    backgroundColor:
      theme.palette.mode === 'dark'
        ? theme.palette.alphaLight300.main
        : theme.palette.white.main,
    zIndex: '-1',
    marginBottom: theme.spacing(1),
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
  width: 'calc( 50% - 8px )',
  letterSpacing: 0,
  display: 'flex',
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
    color: 'inherit',
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

  '&& .MuiTouchRipple-child': {
    backgroundColor:
      theme.palette.mode === 'light'
        ? theme.palette.grey[900]
        : getContrastAlphaColor(theme, '8%'),
  },

  '&& .MuiTouchRipple-rippleVisible': {
    backgroundColor: getContrastAlphaColor(theme, '8%'),
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
  bgColor?: string;
  scrollableMainLayer?: boolean;
  component?: string;
  isScrollable?: boolean;
}

export const NavbarPaper = styled(Paper, {
  shouldForwardProp: (prop) =>
    prop !== 'isDarkMode' &&
    prop !== 'isOpenSubMenu' &&
    prop !== 'openSubMenu' &&
    prop !== 'isSubMenu' &&
    prop !== 'isScrollable' &&
    prop !== 'bgColor' &&
    prop !== 'scrollableMainLayer',
})<NavbarPaperProps>(
  ({
    theme,
    bgColor,
    isDarkMode,
    isOpenSubMenu,
    isScrollable,
    openSubMenu,
    scrollableMainLayer,
    isSubMenu,
  }) => ({
    background: !!bgColor ? bgColor : theme.palette.surface1.main,
    padding: 0,
    marginTop: !!isSubMenu ? 0 : `${theme.spacing(3)} !important`,
    boxShadow: !!isDarkMode
      ? '0px 8px 32px rgba(255, 255, 255, 0.08)'
      : '0px 8px 32px rgba(0, 0, 0, 0.08)',
    borderRadius: '12px 12px 0 0',
    marginBottom: 0,
    maxHeight: 'calc( 100vh - 80px )',
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
      borderRadius: '12px !important',
      width: '288px',
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
  // '&:hover': {
  //   textDecoration: 'none',
  //   backgroundColor: '#0000000A',
  // },
}));

export const MenuItemLabel = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

export const MenuItemText = styled('span')({});

export interface MenuHeaderAppWrapperProps
  extends Omit<ListItemProps, 'isScrollable'> {
  component?: string;
  bgColor?: string;
  isScrollable?: boolean;
  scrollableMainLayer?: boolean;
}

export const MenuHeaderAppWrapper = styled(ListItem, {
  shouldForwardProp: (prop) =>
    prop !== 'isScrollable' &&
    prop !== 'scrollableMainLayer' &&
    prop !== 'bgColor',
})<MenuHeaderAppWrapperProps>(({ bgColor }) => ({
  position: 'sticky',
  top: 0,
  alignItems: 'center',
  backgroundColor: bgColor ? bgColor : 'transparent', //theme.palette.surface1.main
  backdropFilter: 'blur(12px)',
  zIndex: 1,
  overflow: 'hidden',
  margin: '0 -12px',
  padding: '0 12px',
  width: 'calc( 100% + 12px * 2 )',
  marginTop: 'inherit',
  height: '64px',
}));

export interface MenuHeaderAppBarProps extends Omit<AppBarProps, 'component'> {
  component?: string;
  isScrollable?: boolean;
  scrollableMainLayer?: boolean;
}

export const MenuHeaderAppBar = styled(AppBar, {
  shouldForwardProp: (prop) =>
    prop !== 'isScrollable' && prop !== 'scrollableMainLayer',
})<MenuHeaderAppBarProps>(({ theme }) => ({
  backgroundColor: 'transparent !important',
  zIndex: 1,
  position: 'fixed',
  width: 'calc( 100% - 24px )',
  top: 'initial',
  left: 'initial',
  right: 'initial',
  backdropFilter: 'blur(12px)',
  padding: theme.spacing(0, 3, 0, 3),
  color: theme.palette.text.primary,
  flexDirection: 'row',
  alignItems: 'center',
  minHeight: 48,
}));
