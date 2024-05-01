import { styled } from '@mui/system';

export const LogoWrapper = styled('div')(({ theme }) => ({
  cursor: 'pointer',
  display: 'flex',
  [theme.breakpoints.down('sm')]: {
    '& .jumper-learn-logo, & .jumper-logo, ': {
      width: 32,
      height: 32,
    },
    '& .jumper-learn-logo-desktop, & .jumper-logo-desktop': {
      display: 'none',
    },
  },
}));
