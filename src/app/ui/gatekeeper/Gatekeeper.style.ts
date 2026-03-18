import { ButtonPrimary } from '@/components/Button/Button.style';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { Link } from '@/components/Link/Link';

export const GatekeeperIllustrationWrapper = styled(Box)(({}) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  marginRight: 'auto',
  marginLeft: 'auto',
  transition: 'margin-top 0.3s ease-in-out',
  willChange: 'margin-top',
}));

export const GatekeeperRequestAccessLink = styled(Link)(({ theme }) => ({
  ...theme.typography.bodyMediumStrong,
  display: 'inline-block',
  borderRadius: theme.shape.buttonBorderRadius,
  textTransform: 'none',
  textDecoration: 'none',
  transition: 'background-color 250ms',
  overflow: 'hidden',
  padding: theme.spacing(1.75, 2),
  color: (theme.vars || theme).palette.white.main,
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
