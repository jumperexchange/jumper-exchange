import { ButtonPrimary } from '@/components/Button';
import { getSurfaceBorder } from '@/theme/utils/getSurfaceBorder';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import type { ButtonProps } from '@mui/material/Button';
import type { Theme } from '@mui/material/styles';
import {
  ButtonSecondary,
  ButtonTransparent,
} from '@/components/Button/Button.style';

import MuiMoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MuiMenuRoundedIcon from '@mui/icons-material/MenuRounded';

import { styled } from '@mui/material/styles';

export const ConnectNavbarButton = styled(ButtonPrimary)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  margin: 'auto',
  textWrap: 'nowrap',
  height: 32,
  [theme.breakpoints.up('sm')]: {
    height: 40,
  },
  [theme.breakpoints.up('lg')]: {
    height: 48,
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

// Applied to the caption-variant label so NavbarButton can drive its color
// from the button's selected/hover state: muted (alpha600) by default, primary
// once the button is selected or hovered.
export const navbarLabelClassName = 'JumperNavbarLabel';

export const NavbarButton = styled(ButtonTransparent, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<NavbarButtonProps>(({ theme }) => ({
  padding: theme.spacing(1),
  borderRadius: theme.shape.buttonBorderRadius,
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
        [`& .${navbarLabelClassName}`]: {
          color: (theme.vars || theme).palette.alpha600.main,
        },
        '&:hover': {
          background: (theme.vars || theme).palette.alphaLight100.main,
          [`& .${navbarLabelClassName}`]: {
            color: (theme.vars || theme).palette.text.primary,
          },
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
        border: getSurfaceBorder(theme, 'surface2'),
        color: (theme.vars || theme).palette.text.primary,
        pointerEvents: 'none',
        [`& .${navbarLabelClassName}`]: {
          color: (theme.vars || theme).palette.text.primary,
        },
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

export const NavbarButtonLabelColumn = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  textAlign: 'left',
}));

export const PassProgressChip = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0.75),
  borderRadius: theme.shape.buttonBorderRadius,
  backgroundColor: (theme.vars || theme).palette.buttonLightBg,
  boxShadow: theme.shadows[2],
  color: (theme.vars || theme).palette.statusProgress,
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
      border: getSurfaceBorder(theme, 'surface2'),
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

const getIconProps = (theme: Theme) => ({
  fontSize: '24px',
  color: (theme.vars || theme).palette.white.main,
  ...theme.applyStyles('light', {
    color: (theme.vars || theme).palette.black.main,
  }),
});

export const DotsMenuIcon = styled(MuiMoreHorizIcon)(({ theme }) =>
  getIconProps(theme),
);

export const BurgerMenuIcon = styled(MuiMenuRoundedIcon)(({ theme }) =>
  getIconProps(theme),
);
