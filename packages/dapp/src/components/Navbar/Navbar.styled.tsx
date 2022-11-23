import {
  AppBar,
  Button,
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
    color: theme.palette.brandPrimary.main,
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
    backgroundColor: 'white',
    margin: 'auto',
    height: 48,
    borderRadius: 24,
    padding: 4,
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

export const NavbarContainer = styled('div')`
  background: transparent;
  height: 75px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
`;

export interface NavbarLinkType extends Omit<LinkProps, 'active'> {
  active?: boolean;
  hoverBackgroundColor?: string;
  // theme?: ITheme;
}

export const NavbarLink = styled(Link, {
  shouldForwardProp: (prop) =>
    prop !== 'hoverBackgroundColor' && prop !== 'active',
})<NavbarLinkType>(({ theme, active, hoverBackgroundColor }) => ({
  backgroundColor: !!active ? '#F3EBFF' : 'transparent',
  borderRadius: 20,
  width: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontWeight: '700',
  fontSize: '14px',
  lineHeight: '20px',
  color: 'black',
  textDecoration: 'none',
  '&:hover': {
    backgroundColor: !!hoverBackgroundColor
      ? hoverBackgroundColor
      : theme.palette.brandSecondary.main,
  },
}));

export const NavbarLinkText = styled('span')({});

export const NavbarDropdownButton = styled(Button)({
  backgroundColor: 'white',
  justifyContent: 'center',
  color: '#000000',
  width: '48px',
  marginLeft: '8px',
  minWidth: 'unset',
  height: '48px',
  borderRadius: '100%',
  '&:hover': {
    backgroundColor: 'white',
  },
});

export const MenuHeader = styled(MUIMenuItem)({
  '& svg': {
    position: 'absolute',
  },
});

export const MenuHeaderText = styled('span')({
  margin: '8px auto',
  fontWeight: 700,
});

export const MenuItem = styled(MUIMenuItem)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  '> .menu-item-label__icon': {
    marginLeft: '13px',
  },
  [theme.breakpoints.up('sm')]: {
    height: '48px',
  },
}));

export const MenuLinkItem = styled(Link)({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '6px 16px',
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
});

export const MenuButton = styled(Button)({
  height: '48px',
  width: '100%',
  color: '#31007A',
  backgroundColor: '#F3EBFF',
});

export const MenuItemLabel = styled('div')({
  display: 'flex',
  alignItems: 'center',
  '& > .menu-item-label__icon': {
    marginRight: '13px',
  },
  '& svg': {
    marginRight: '13px',
  },
});

export const MenuItemText = styled('span')({});
