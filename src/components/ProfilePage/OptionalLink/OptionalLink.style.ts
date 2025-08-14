import { Box, styled } from '@mui/material';
import Link from 'next/link';

export const OptionalLinkFallbackContainer = styled(Box)(() => ({
  cursor: 'not-allowed',
  display: 'flex',
  flexDirection: 'column',
  maxWidth: 'inherit',
  minWidth: 'inherit',
  width: 'inherit',
}));

export const OptionalLinkContainer = styled(Link)(() => ({
  maxWidth: 'inherit',
  minWidth: 'inherit',
  width: 'inherit',
  textDecoration: 'inherit',
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
}));
