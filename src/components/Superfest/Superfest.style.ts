import { Box, Container, Typography, alpha, styled } from '@mui/material';

export const SuperfestContainer = styled(Box)(() => ({
  background: 'transparent',
  position: 'relative',
  width: '100% !important',
  overflow: 'hidden',
  paddingBottom: 20,
}));

export const CenteredBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
}));

export const SuperStackMainBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
}));
