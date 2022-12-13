import { AppBar } from '@mui/material';

import {
  Button,
  ButtonProps,
  Link,
  LinkProps,
  MenuItem as MUIMenuItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// TODO: Use Colors from Theme instead of hard-coded ones

export const MenuBrand = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  margin: `auto ${theme.spacing(4)} auto ${theme.spacing(2)}`,
  textDecoration: 'none',
  position: 'absolute',
  '&:hover': {
    color: theme.palette.primary.main,
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
  opacity: 0.25,
}));

export const NavbarManagement = styled('div')({
  justifySelf: 'self-end',
});

export const NavbarLinkContainer = styled('div')(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.up('md')]: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: theme.palette.mode === 'dark' ? '#231a31' : '#0000000A',
    margin: 'auto',
    height: 48,
    borderRadius: 24,
    padding: 1,
    display: 'flex',
    width: 390,
  },
}));

export const NavBar = styled(AppBar)(({ theme }) => ({
  marginTop: 16,
  background: 'transparent',
  boxShadow: 'none',
  // color: theme.palette.text.primary,
}));

export const NavbarContainer = styled('div')(({ theme }) => ({
  background: 'transparent',
  height: '75px',
  padding: theme.spacing(6),
  display: 'flex',
  justifyContent: 'space-between',
}));

export interface NavbarLinkType extends Omit<LinkProps, 'active'> {
  active?: boolean;
  hoverBackgroundColor?: string;
  // theme?: ITheme;
}

export interface ButtonType extends Omit<ButtonProps, 'mainCol'> {
  mainCol?: string;
}

export const NavbarLink = styled(Link, {
  shouldForwardProp: (prop) =>
    prop !== 'hoverBackgroundColor' && prop !== 'active',
})<NavbarLinkType>(({ theme, active, hoverBackgroundColor }) => ({
  backgroundColor: !active
    ? 'transparent'
    : theme.palette.mode === 'dark'
    ? '#352b42'
    : theme.palette.grey[100],
  borderRadius: 20,
  width: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: 4,
  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontWeight: '700',
  fontSize: '14px',
  lineHeight: '20px',
  color:
    theme.palette.mode === 'dark'
      ? theme.palette.grey[100]
      : theme.palette.grey[900],
  textDecoration: 'none',
  '&:hover': {
    backgroundColor: !!hoverBackgroundColor
      ? hoverBackgroundColor
      : theme.palette.secondary.main,
  },
}));

export const NavbarDropdownButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'mainCol',
})<ButtonType>(({ theme, mainCol }) => ({
  justifyContent: 'center',
  color: !!mainCol ? mainCol : '#31007A',
  width: '48px',
  marginLeft: theme.spacing(2),
  minWidth: 'unset',
  height: '48px',
}));

export const NavbarLinkText = styled('span')({});
// borderRadius: '100%',
// '&:hover': {
//   backgroundColor: 'white',
// },

export const MenuHeader = styled('div')(({ theme }) => ({
  padding: '0',
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  margin: '0 auto',
  '& svg': {
    position: 'absolute',
  },
}));

export const MenuHeaderText = styled('span')(({ theme }) => ({}));

export const MenuItem = styled(MUIMenuItem)(({ theme }) => ({
  display: 'flex',
  padding: `0 24px`,
  justifyContent: 'space-between',
  '> .menu-item-label__icon': {
    marginLeft: '13px',
  },
  [theme.breakpoints.up('sm')]: {
    height: '48px',
  },
}));

export const MenuLinkItem = styled(Link)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: `0 24px`,
  height: '48px',
  textDecoration: 'none',
  color: 'inherit',
  '> .menu-item-label__icon': {
    marginLeft: '13px',
  },
  '&:hover': {
    textDecoration: 'none',
    backgroundColor: '#0000000A',
  },
}));

export const MenuButton = styled(Button)(({ theme }) => ({
  height: '48px',
  width: '100%',
  borderRadius: '24px',
  color: theme.palette.primary.main,
  backgroundColor: '#F3EBFF',
}));

export const MenuItemLabel = styled('div')({
  display: 'flex',
  alignItems: 'center',
  // '& svg, .menu-item-label__icon': {
  //   marginRight: '13px',
  // },
});

export const MenuItemText = styled('span')({});

export const MenuHeaderAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'pt',
})<{ pt?: number }>(({ theme }) => ({
  backgroundColor: 'transparent',
  color: theme.palette.text.primary,
  flexDirection: 'row',
  alignItems: 'center',
  position: 'relative',
  minHeight: 48,
  padding: theme.spacing(0, 3, 0, 3),
}));
