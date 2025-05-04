import { styled } from '@mui/material/styles';
import { ButtonPrimary } from 'src/components/Button';

export const ClaimingButton = styled(ButtonPrimary, {
  shouldForwardProp: (prop) => prop !== 'isDisabled',
})<{ isDisabled?: boolean }>(({ theme, isDisabled }) => ({
  ...(isDisabled && { opacity: '0.3' }),
  alignItems: 'center',
  padding: '16px',
  width: '100%',
  minWidth: theme.spacing(12),
  color: theme.palette.white.main,
  typography: {
    xs: theme.typography.bodySmallStrong,
  },
}));
