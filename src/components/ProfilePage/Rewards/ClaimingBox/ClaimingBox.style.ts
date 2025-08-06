import { styled } from '@mui/material/styles';
import { ButtonPrimary } from 'src/components/Button';

export const ClaimingButton = styled(ButtonPrimary, {
  shouldForwardProp: (prop) => prop !== 'isDisabled',
})<{ isDisabled?: boolean }>(({ theme, isDisabled }) => ({
  alignItems: 'center',
  padding: '16px',
  width: '100%',
  minWidth: theme.spacing(12),
  color: (theme.vars || theme).palette.white.main,
  '&.Mui-disabled': {
    color: (theme.vars || theme).palette.white.main,
  },
  '.MuiButton-icon': {
    width: '20px !important',
  },

  '.MuiButton-loadingWrapper .MuiButton-loadingIndicator': {
    marginLeft: '8px',
  },
  typography: {
    xs: theme.typography.bodySmallStrong,
  },
}));
