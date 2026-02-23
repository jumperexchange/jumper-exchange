import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

export const DustBannerContainer = styled(Box)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.accent1.main,
  color: (theme.vars || theme).palette.textPrimaryInverted,
  padding: theme.spacing(1, 1.5),
  borderRadius: theme.shape.radius8,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    borderRadius: theme.shape.radius32,
  },
}));

export const DustBannerContentContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 1.5),
  borderRadius: theme.shape.radius32,
  flex: 1,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(1.25),
}));
