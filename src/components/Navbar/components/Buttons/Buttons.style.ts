import { ButtonPrimary } from '@/components/Button';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import {
  ButtonSecondary,
  ButtonTransparent,
} from '@/components/Button/Button.style';
import type { ButtonProps } from '@mui/material';

import MuiMoreHorizIcon from '@mui/icons-material/MoreHoriz';

import { styled } from '@mui/material/styles';

export const ConnectNavbarButton = styled(ButtonPrimary)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  margin: 'auto',
  textWrap: 'nowrap',
  height: 32,
  [theme.breakpoints.up('sm')]: {
    height: 40,
  },
}));

export const ConnectNavbarButtonLabel = styled(Typography)(() => ({
  display: '-webkit-box',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
}));

interface NavbarButtonProps {
  isActive?: boolean;
}

export const NavbarButton = styled(ButtonTransparent, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<NavbarButtonProps>(({ theme }) => ({
  padding: theme.spacing(1),
  minWidth: 48,
  background: 'transparent',
  boxShadow: 'none',
  transition: 'background-color 0.2s ease-in-out',
  '&:hover:before': {
    background: 'transparent',
  },
  variants: [
    {
      props: ({ isActive }) => !isActive,
      style: {
        color: (theme.vars || theme).palette.text.primary,
        '&:hover': {
          background: (theme.vars || theme).palette.alphaLight100.main,
        },
        ...theme.applyStyles('light', {
          background: 'transparent',
          color: (theme.vars || theme).palette.buttonAlphaLightAction,
          '&:hover': {
            background: (theme.vars || theme).palette.buttonAlphaLightBg,
          },
        }),
      },
    },
    {
      props: ({ isActive }) => isActive,
      style: {
        background: (theme.vars || theme).palette.surface2.main,
        color: (theme.vars || theme).palette.text.primary,
        pointerEvents: 'none',
        ...theme.applyStyles('light', {
          background: (theme.vars || theme).palette.buttonLightBg,
          color: (theme.vars || theme).palette.buttonLightAction,
        }),
      },
    },
  ],
}));

export const NavbarButtonContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(0, 0.25),
  height: 32,
}));

export const NavbarButtonLabelSkeleton = styled(Skeleton)(() => ({
  fontSize: 24,
  minWidth: 25,
  marginRight: 1.1,
  marginLeft: 1.1,
}));

export const NavbarButtonLabel = styled(Typography)(() => ({
  whiteSpace: 'nowrap',
  display: 'block',
  width: 'auto',
  color: 'inherit',
}));

export const NavbarMenuToggleButton = styled(ButtonSecondary)<ButtonProps>(({
  theme,
}) => {
  return {
    justifyContent: 'center',
    backgroundColor: 'transparent',
    color: (theme.vars || theme).palette.accent1Alt.main,
    width: 40,
    height: 40,
    borderRadius: '50%',
    minWidth: 'unset',
    '&[aria-expanded="true"]': {
      backgroundColor: (theme.vars || theme).palette.surface2.main,
    },
    ':not([aria-expanded="true"]):hover': {
      backgroundColor: (theme.vars || theme).palette.alphaLight100.main,
    },
    ...theme.applyStyles('light', {
      color: (theme.vars || theme).palette.primary.main,
      '&[aria-expanded="true"]': {
        backgroundColor: (theme.vars || theme).palette.buttonLightBg,
        boxShadow: theme.shadows[2],
      },
      ':not([aria-expanded="true"]):hover': {
        backgroundColor: (theme.vars || theme).palette.buttonAlphaLightBg,
        boxShadow: theme.shadows[2],
      },
    }),
  };
});

export const DotsMenuIcon = styled(MuiMoreHorizIcon)(({ theme }) => ({
  fontSize: '24px',
  color: theme.palette.white.main,
  ...theme.applyStyles('light', {
    color: theme.palette.black.main,
  }),
}));
