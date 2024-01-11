import { Button, Container, styled } from '@mui/material';

export const ConnectButton = styled(Button)(({ theme }) => ({
  boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.04)',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flex: ' 1 0 0',
  cursor: 'pointer',
  background: theme.palette.surface2.main,
}));

export const ConnectButtonContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  gap: '16px',
  alignSelf: 'stretch',
  background: theme.palette.surface1.main,
}));
