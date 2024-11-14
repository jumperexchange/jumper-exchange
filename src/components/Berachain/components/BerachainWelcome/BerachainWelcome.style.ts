import { Box, Button, Typography } from '@mui/material';
import { alpha, darken, styled } from '@mui/material/styles';

export const BeraChainWelcomeBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

export const BeraChainWelcomeContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  color: theme.palette.white.main,
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: -72,
  zIndex: 1,
}));

export const BeraChainWelcomeIllustrations = styled(Box)(({ theme }) => ({}));

export const BeraChainWelcomeSubtitleBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: theme.spacing(3),
}));

export const BeraChainWelcomeSubtitleLabel = styled(Typography)(
  ({ theme }) => ({
    display: 'flex',
    alignContent: 'center',
    backgroundColor: '#FBC6A7',
    color: '#2C1A16',
    height: 24,
    padding: theme.spacing(0.25, 1.5),
    borderRadius: '12px',
  }),
);

export const BeraChainWelcomeTitle = styled(Typography)(({ theme }) => ({
  fontSize: '96px',
  fontStyle: 'normal',
  fontWeight: 700,
  lineHeight: '112px',
  marginTop: theme.spacing(1.5),
}));

export const BeraChainWelcomeButtonsWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginTop: theme.spacing(4),
  gap: theme.spacing(2),
}));

export const BeraChainWelcomeConnectButtonCTA = styled(Button)(({ theme }) => ({
  boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.04)',
  color: theme.palette.black.main,
  backgroundColor: theme.palette.white.main,
  '&:hover': {
    backgroundColor: darken(theme.palette.white.main, 0.2),
  },
}));

export const BeraChainWelcomeLearnMoreButton = styled(Button)(({ theme }) => ({
  color: theme.palette.white.main,
  backgroundColor: alpha(theme.palette.white.main, 0.24),
  '&:hover': {
    backgroundColor: alpha(theme.palette.white.main, 0.48),
  },
}));
