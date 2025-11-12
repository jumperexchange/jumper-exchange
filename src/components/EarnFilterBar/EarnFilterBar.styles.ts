import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { BaseSurfaceSkeleton } from '../core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';

export const EarnFilterBarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.cardBorderRadius,
  boxShadow: theme.shadows[2],
  backgroundColor: (theme.vars || theme).palette.surface1.main,
  padding: theme.spacing(2),
  gap: theme.spacing(2),
  overflow: 'hidden',
  ...theme.applyStyles('dark', {
    backgroundColor: (theme.vars || theme).palette.surface2.main,
  }),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(3),
  },
}));

export const EarnFilterBarHeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  gap: theme.spacing(2),
}));

export const EarnFilterBarContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  gap: theme.spacing(2),
}));

export const BaseSkeleton = styled(BaseSurfaceSkeleton)(({ theme }) => ({
  borderRadius: theme.shape.buttonBorderRadius,
}));

export const EarnFilterBarClearFiltersButton = styled(IconButton)(
  ({ theme }) => ({
    height: 40,
    width: 40,
    backgroundColor: (theme.vars || theme).palette.buttonAlphaDarkBg,
    color: (theme.vars || theme).palette.buttonAlphaLightAction,
    '&:hover': {
      backgroundColor: (theme.vars || theme).palette.buttonActiveBg,
      color: (theme.vars || theme).palette.buttonActiveAction,
    },
  }),
);
