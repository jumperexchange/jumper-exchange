import {
  alpha,
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Card,
  darken,
  Input,
  styled,
  Typography,
} from '@mui/material';

interface ContributionWrapperProps extends BoxProps {
  showContribution: boolean;
}

export const ContributionWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'showContribution',
})<ContributionWrapperProps>(({ showContribution }) => ({
  position: 'relative',
  transition: 'height 250ms',
  height: showContribution ? '156px' : '0px',
}));

export const DrawerWrapper = styled(Box)(() => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
  overflow: 'hidden',
  borderRadius: '24px',
}));

export const ContributionCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  border: 'unset',
  padding: theme.spacing(2),
  borderRadius: '16px',
  boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.04)',
}));

export const ContributionCardTitle = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  lineHeight: '20px',
  fontWeight: 700,
}));

export const ContributionCustomInput = styled(Input, {
  shouldForwardProp: (prop) => prop !== 'active',
})(() => ({
  height: '32px',
  borderRadius: '16px',
  '& .MuiInputBase-input::placeholder': {
    opacity: 1,
    textAlign: 'center',
  },
}));

interface ContributionButtonProps extends ButtonProps {
  active: boolean;
  mode: 'light' | 'dark' | 'system' | undefined;
}

export const ContributionButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'mode',
})<ContributionButtonProps>(({ theme, active, mode }) => ({
  width: '100%',
  fontSize: '12px',
  lineHeight: '16px',
  fontWeight: 700,
  height: '32px',

  transition: 'background-color 250ms',
  color: (theme.vars || theme).palette.text.primary,
  backgroundColor: active
    ? 'rgba(101, 59, 163, 0.84) !important'
    : (theme.vars || theme).palette.grey[200] + ' !important',
  '&:hover': {
    backgroundColor: active
      ? '#653BA3 !important'
      : (theme.vars || theme).palette.grey[300] + ' !important',
  },
  ...(mode === 'light' && {
    backgroundColor: active ? '#F0E5FF' : theme.palette.grey[100],
    '&:hover': {
      backgroundColor: active
        ? darken('#F0E5FF', 0.08)
        : theme.palette.grey[300],
    },
  }),
}));

interface ContributionButtonConfirmProps extends ContributionButtonProps {
  isTxConfirmed: boolean;
}

export const ContributionButtonConfirm = styled(ContributionButton, {
  shouldForwardProp: (prop) => prop !== 'isTxConfirmed',
})<ContributionButtonConfirmProps>(({ isTxConfirmed, mode }) => ({
  height: '40px',
  fontSize: '14px',
  lineHeight: '16px',
  fontWeight: 700,
  gap: '8px',
  ...(isTxConfirmed && {
    backgroundColor: '#D6FFE7',
    color: '#00B849',
    '&:hover': {
      backgroundColor: darken('#D6FFE7', 0.04),
    },
  }),
}));

export const ContributionDescription = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  lineHeight: '16px',
  fontWeight: 500,
  color: alpha('#fff', 0.84),
  height: '40px',

  ...theme.applyStyles('light', {
    color: theme.palette.grey[700],
  }),
}));
