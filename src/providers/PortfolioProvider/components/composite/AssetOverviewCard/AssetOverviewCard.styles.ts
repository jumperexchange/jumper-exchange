import { getSurfaceBorder } from '@/theme/utils/getSurfaceBorder';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import type { ButtonProps } from '@/components/Button';
import { ButtonTransparent } from '@/components/Button';
import { SectionCardContainer } from '@/components/Cards/SectionCard/SectionCard.style';

export const CardContainer = styled(SectionCardContainer)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: (theme.vars || theme).palette.surface1.main,
  border: getSurfaceBorder(theme, 'surface1'),
}));

export const NavigationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

interface NavigationButtonProps extends Omit<ButtonProps, 'variant'> {
  isActive: boolean;
}

export const NavigationButton = styled(ButtonTransparent, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<NavigationButtonProps>(({ theme }) => ({
  '&.MuiButton-root.MuiButtonBase-root': {
    ...theme.typography.bodyXSmallStrong,
    borderRadius: theme.shape.buttonBorderRadius,
    padding: theme.spacing(1),
    height: 'auto',
    backgroundColor: 'transparent',
    color: (theme.vars || theme).palette.buttonAlphaDarkAction,
    '&:hover': {
      backgroundColor: (theme.vars || theme).palette.buttonAlphaDarkBg,
      color: (theme.vars || theme).palette.buttonAlphaDarkAction,
    },
  },
  variants: [
    {
      props: ({ isActive }) => isActive,
      style: {
        '&.MuiButton-root.MuiButtonBase-root': {
          backgroundColor: (theme.vars || theme).palette.buttonAlphaDarkBg,
          color: (theme.vars || theme).palette.buttonAlphaDarkAction,
        },
      },
    },
    {
      props: ({ disabled }) => !!disabled,
      style: {
        '&.MuiButton-root.MuiButtonBase-root': {
          backgroundColor: (theme.vars || theme).palette.buttonDisabledBg,
          color: (theme.vars || theme).palette.buttonDisabledAction,
        },
      },
    },
  ],
}));

export const ContentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 0),
}));

export const OverviewContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 0),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));

export const OverviewColumnContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  flexBasis: '50%',
  '& .MuiStack-root + .MuiTypography-root': {
    ...theme.typography.bodySmallStrong,
  },
}));

export const AssetsContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5, 0),
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
  gap: theme.spacing(1),
  overflow: 'hidden',
}));

export const NoContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

export const SharedDescriptionContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

export const NoContentCtaContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
  },
}));
