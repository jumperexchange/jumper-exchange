import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

export const WalletBalanceCardContainer = styled(Box)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.surface2.main,
  ...theme.applyStyles('light', {
    backgroundColor: (theme.vars || theme).palette.surface1.main,
  }),
  boxShadow: theme.shadows[2],
  borderRadius: theme.shape.cardBorderRadius,
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

export const WalletBalanceSharedContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
}));

export const WalletTotalBalanceValue = styled(Typography)(({ theme }) => ({
  color: (theme.vars || theme).palette.text.primary,
  textOverflow: 'ellipsis',
  fontWeight: '700',
  fontSize: '48px',
  lineHeight: '64px',
  fontFamily: 'var(--font-inter)',
  userSelect: 'none',
}));

export const BaseSkeleton = styled(Skeleton)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.surface1.main,
  transform: 'none',
  ...theme.applyStyles('light', {
    backgroundColor: (theme.vars || theme).palette.surface2.main,
  }),
}));

export const BaseIconButton = styled(IconButton)(({ theme }) => ({
  boxShadow: theme.shadows[2],
  padding: theme.spacing(0.75),
}));

export const LightIconButton = styled(BaseIconButton)(({ theme }) => ({
  color: (theme.vars || theme).palette.buttonLightAction,
  backgroundColor: (theme.vars || theme).palette.buttonLightBg,
}));

export const DarkIconButton = styled(BaseIconButton)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.buttonAlphaDarkBg,
  color: (theme.vars || theme).palette.buttonAlphaDarkAction,
  ...theme.applyStyles('light', {
    backgroundColor: (theme.vars || theme).palette.buttonAlphaDarkBg,
    color: (theme.vars || theme).palette.buttonAlphaDarkAction,
  }),

  '&:hover': {
    backgroundColor: (theme.vars || theme).palette.buttonActiveBg,
    color: (theme.vars || theme).palette.buttonActiveAction,
  },
}));

export const SecondaryIconButton = styled(BaseIconButton)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.buttonSecondaryBg,
  color: (theme.vars || theme).palette.buttonSecondaryAction,
}));

export const WalletInfoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));
