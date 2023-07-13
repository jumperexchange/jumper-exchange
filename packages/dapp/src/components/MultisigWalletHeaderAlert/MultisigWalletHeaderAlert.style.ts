import { alpha, styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const MultisigWalletHeaderAlertContainer = styled(Box)(({ theme }) => ({
  backgroundColor: `${alpha(theme.palette.info.main, 0.12)}`,
  padding: '16px !important',
  boxShadow: `0px 8px 16px ${alpha(theme.palette.common.black, 0.04)}`,
  borderRadius: '12px',
  maxWidth: '392px',
  margin: '2rem auto 0.5rem auto',
  display: 'block !important',
}));

export const MultisigWalletHeaderAlertTitle = styled(Box)(({ theme }) => ({
  color: theme.palette.info.main,
  display: 'flex',
  alignItems: 'center',
  fontSize: '0.875rem',
}));

export const MultisigWalletHeaderAlertContent = styled(Box)(({ theme }) => ({
  fontSize: '0.875rem',
}));
