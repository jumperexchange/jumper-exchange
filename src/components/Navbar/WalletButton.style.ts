import { ButtonPrimary } from '@/components/Button';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { ButtonTransparent } from '../Button';
import { styled } from '@mui/material/styles';

export const ConnectButtonWrapper = styled(ButtonPrimary)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  margin: 'auto',
  textWrap: 'nowrap',
  height: 32,
  [theme.breakpoints.up('sm')]: {
    height: 40,
  },
}));

export const ConnectButtonLabel = styled(Typography)(({ theme }) => ({
  display: '-webkit-box',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
}));

export const WalletMenuButton = styled(ButtonTransparent)(({ theme }) => ({
  padding: theme.spacing(1),
  minWidth: 48,
  gap: '0.5rem',
  backgroundColor: 'transparent',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: (theme.vars || theme).palette.alphaLight200.main,
  },
  '&:hover:before': {
    backgroundColor: 'transparent',
  },
  ...theme.applyStyles('light', {
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: (theme.vars || theme).palette.alphaLight600.main,
    },
  }),
}));

export const SkeletonWalletMenuButton = styled(Skeleton)(({ theme }) => ({
  fontSize: 24,
  minWidth: 25,
  marginRight: 1.1,
  marginLeft: 1.1,
}));

export const WalletLabel = styled(Typography)(({ theme }) => ({
  display: 'block',
  marginRight: theme.spacing(0.25),
  marginLeft: theme.spacing(0.75),
  width: 'auto',
  color: (theme.vars || theme).palette.white.main,
  ...theme.applyStyles('light', {
    color: (theme.vars || theme).palette.alphaDark900.main,
  }),
}));
