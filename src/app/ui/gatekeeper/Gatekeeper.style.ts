import { ButtonPrimary } from '@/components/Button/Button.style';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import { Link } from '@/components/Link';

export const GatekeeperOverlayContentContainer = styled(Box)(({ theme }) => ({
  transition: 'margin-top 0.3s ease-in-out',
  willChange: 'margin-top',
  marginTop: theme.spacing(8),
  [theme.breakpoints.up('sm')]: {
    marginTop: theme.spacing(20),
  },
}));

const responsiveImageStyles = {
  width: '100%',
  height: 'auto',
  margin: '0 auto',
};

export const GatekeeperMobileImage = styled(Image)(({ theme }) => ({
  ...responsiveImageStyles,
  display: 'block',
  [theme.breakpoints.up('sm')]: {
    display: 'none',
  },
}));

export const GatekeeperDesktopImage = styled(Image)(({ theme }) => ({
  ...responsiveImageStyles,
  display: 'none',
  [theme.breakpoints.up('sm')]: {
    display: 'block',
  },
}));

export const GatekeeperRequestAccessLink = styled(Link)(({ theme }) => ({
  ...theme.typography.bodyMediumStrong,
  borderRadius: '24px',
  textTransform: 'none',
  textDecoration: 'none',
  transition: 'background-color 250ms',
  overflow: 'hidden',
  padding: theme.spacing(1.75, 2),
  color: (theme.vars || theme).palette.text.primary,
  backgroundColor: (theme.vars || theme).palette.primary.main,
  '&:hover': {
    backgroundColor: (theme.vars || theme).palette.primary.main,
    ...theme.applyStyles('light', {
      backgroundColor: (theme.vars || theme).palette.accent1.main,
    }),
  },
}));

export const LoadingButton = styled(ButtonPrimary)(({ theme }) => ({
  ...theme.typography.bodyMediumStrong,
  padding: theme.spacing(1.75, 2),
  textWrap: 'nowrap',
  color: (theme.vars || theme).palette.buttonDisabledAction,
  backgroundColor: (theme.vars || theme).palette.buttonDisabledBg,
}));
