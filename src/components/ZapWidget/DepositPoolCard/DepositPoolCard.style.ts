import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import InfoIcon from '@mui/icons-material/Info';
import Typography from '@mui/material/Typography';

export const DepositPoolCardContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  boxShadow: theme.shadows[2],
  borderRadius: theme.shape.cardBorderRadius,
  display: 'flex',
  flexGrow: 1,
  flexDirection: 'column',
  gap: theme.spacing(3),
  backgroundColor: (theme.vars || theme).palette.surface1.main,
  [theme.breakpoints.up('md')]: {
    minWidth: 416,
    maxWidth: 'unset',
  },
}));

export const DepositPoolHeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  alignItems: 'center',
}));

export const DepositPoolCardItemHeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'center',
}));

export const DepositPoolCardItemContentContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(0.5),
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'baseline',
}));

export const TooltipIcon = styled(InfoIcon)(({ theme }) => ({
  height: '16px',
  width: '16px',
  cursor: 'help',
  color: (theme.vars || theme).palette.alphaLight600.main,
  ...theme.applyStyles('light', {
    color: (theme.vars || theme).palette.alphaDark600.main,
  }),
}));

export const DepositPoolCardItemValuePrepend = styled(Box)(({ theme }) => ({}));

export const DepositPoolCardItemValueAppend = styled(Typography)(
  ({ theme }) => ({
    mb: theme.spacing(0.25),
    color: (theme.vars || theme).palette.alphaLight800.main,
    ...theme.applyStyles('light', {
      color: (theme.vars || theme).palette.alphaDark800.main,
    }),
  }),
);
