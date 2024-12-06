import { Box, styled } from '@mui/system';

export const BerachainActionProtocolBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(3),
  flexDirection: 'column',
  // align-items: flex-start,
  gap: theme.spacing(2),
  borderRadius: '24px',
  background: '#121214',
  boxShadow: '0px 4px 24px 0px rgba(0, 0, 0, 0.08)',
}));
