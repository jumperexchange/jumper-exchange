import { Box, styled } from '@mui/material';

export const InformationBox = styled(Box)(({ theme }) => ({
  width: '80%',
  maxWidth: '960px',
  display: 'flex',
  color: (theme.vars || theme).palette.text.primary,
  marginTop: '32px',
  flexDirection: 'row',
  justifyContent: 'center',
  alignContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  border: '2px solid',
  padding: '32px',
  borderRadius: '24px',
  borderColor: (theme.vars || theme).palette.text.primary,
}));
